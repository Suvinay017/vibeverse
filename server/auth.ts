import express from 'express';
import { users, insertUserSchema } from '../shared/schema';
import { storage } from './storage';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = express.Router();

// Special handling for Firebase auth
const FIREBASE_AUTH_PASSWORD = 'firebase-auth';

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1), // Allow any length for Firebase auth
});

const signupSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1), // Allow any length for Firebase auth
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body.username);
    const { username, password } = loginSchema.parse(req.body);
    
    const user = await storage.getUserByUsername(username);
    if (!user) {
      console.log(`User ${username} not found`);
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // If using Firebase auth, we skip password validation 
    if (password !== FIREBASE_AUTH_PASSWORD) {
      // Regular password validation
      if (user.password !== password) {
        console.log(`Invalid password for user ${username}`);
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    } else {
      console.log(`Firebase auth used for user ${username}`);
    }
    
    // Set user in session
    if (req.session) {
      req.session.userId = user.id;
      console.log(`User ${username} logged in, session established with ID ${user.id}`);
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: fromZodError(error).message 
      });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body.username);
    const { confirmPassword, ...userData } = signupSchema.parse(req.body);
    
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      console.log(`Username ${userData.username} already taken`);
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Check if email already exists
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      console.log(`Email ${userData.email} already registered`);
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Create default avatar config if not provided
    if (!userData.avatarConfig) {
      userData.avatarConfig = {
        hairStyle: 0,
        hairColor: "#3d2314",
        skinTone: "#ffdbac",
        eyeColor: "#3d2314",
        outfit: 0,
        accessories: []
      };
    }
    
    // Create user
    const newUser = await storage.createUser(userData);
    console.log(`User ${userData.username} created with ID ${newUser.id}`);
    
    // Set user in session
    if (req.session) {
      req.session.userId = newUser.id;
      console.log(`Session established for new user ${userData.username}`);
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: fromZodError(error).message 
      });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  if (req.session) {
    const userId = req.session.userId;
    console.log(`Logging out user ID ${userId}`);
    
    req.session.destroy(err => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      console.log('User successfully logged out');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } else {
    console.log('Logout requested but no active session');
    return res.status(200).json({ message: 'Not logged in' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  if (!req.session || !req.session.userId) {
    console.log('Get current user - not authenticated');
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    console.log(`Getting current user data for ID ${req.session.userId}`);
    const user = await storage.getUser(req.session.userId);
    
    if (!user) {
      console.log(`User ID ${req.session.userId} not found, destroying session`);
      req.session.destroy(() => {});
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Error getting current user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
