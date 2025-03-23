import express from 'express';
import { users, insertUserSchema } from '../shared/schema';
import { storage } from './storage';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';

const router = express.Router();

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(6),
});

const signupSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // In a real app, we'd hash and compare the password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    
    // Set user in session
    if (req.session) {
      req.session.userId = user.id;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
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
    const { confirmPassword, ...userData } = signupSchema.parse(req.body);
    
    // Check if username already exists
    const existingUser = await storage.getUserByUsername(userData.username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Check if email already exists
    const existingEmail = await storage.getUserByEmail(userData.email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Create user
    const newUser = await storage.createUser(userData);
    
    // Set user in session
    if (req.session) {
      req.session.userId = newUser.id;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
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
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out successfully' });
    });
  } else {
    return res.status(200).json({ message: 'Not logged in' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
