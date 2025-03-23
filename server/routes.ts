import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { storage } from "./storage";
import authRoutes from "./auth";
import spotifyRoutes from "./spotify";
import { z } from "zod";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up sessions
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "vibeverse_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
      store: new SessionStore({
        checkPeriod: 86400000, // 24 hours
      }),
    })
  );

  // API routes
  const apiRouter = express.Router();
  
  // Auth routes
  apiRouter.use("/auth", authRoutes);
  
  // Spotify routes
  apiRouter.use("/spotify", spotifyRoutes);
  
  // User routes
  apiRouter.get("/users/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't expose password
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update profile
  apiRouter.put("/users/profile", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const profileSchema = z.object({
        bio: z.string().optional(),
        avatarConfig: z.object({
          hairStyle: z.number(),
          hairColor: z.string(),
          skinTone: z.string(),
          eyeColor: z.string(),
          outfit: z.number(),
          accessories: z.array(z.number())
        }).optional(),
        vibes: z.array(z.string()).optional(),
      });
      
      const profileData = profileSchema.parse(req.body);
      const updatedUser = await storage.updateUser(req.session.userId, profileData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't expose password
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Find matches
  apiRouter.get("/matches/vibe", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const matches = await storage.findVibeMatches(req.session.userId);
      
      // Map to return safe user data
      const safeMatches = matches.map(({ user, score }) => {
        const { password, ...safeUser } = user;
        return { user: safeUser, score };
      });
      
      res.status(200).json(safeMatches);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get all matches
  apiRouter.get("/matches", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const matches = await storage.getMatches(req.session.userId);
      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Update match status
  apiRouter.put("/matches/:id", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const matchId = parseInt(req.params.id, 10);
      if (isNaN(matchId)) {
        return res.status(400).json({ message: "Invalid match ID" });
      }
      
      const statusSchema = z.object({
        status: z.enum(["pending", "accepted", "rejected"])
      });
      
      const { status } = statusSchema.parse(req.body);
      
      const updatedMatch = await storage.updateMatchStatus(matchId, status);
      if (!updatedMatch) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.status(200).json(updatedMatch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid status", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Get messages
  apiRouter.get("/messages/:userId", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const otherUserId = parseInt(req.params.userId, 10);
      if (isNaN(otherUserId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const messages = await storage.getMessages(req.session.userId, otherUserId);
      
      // Mark messages from other user as read
      await storage.markMessagesAsRead(otherUserId, req.session.userId);
      
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Send message
  apiRouter.post("/messages", async (req, res) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    try {
      const messageSchema = z.object({
        receiverId: z.number(),
        content: z.string().min(1)
      });
      
      const { receiverId, content } = messageSchema.parse(req.body);
      
      const message = await storage.createMessage({
        senderId: req.session.userId,
        receiverId,
        content
      });
      
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });
  
  // Add API router to app
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  
  return httpServer;
}
