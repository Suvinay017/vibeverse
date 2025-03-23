import express from 'express';
import { storage } from './storage';
import { z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import type { SpotifyTrack } from '../shared/types';

const router = express.Router();

// This would be your Spotify Client ID and Secret from the Spotify Developer Dashboard
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';
const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5000/api/spotify/callback';

// Mock data for development (in a real app, we'd actually call the Spotify API)
const MOCK_TOP_TRACKS: SpotifyTrack[] = [
  {
    id: '1',
    name: 'Bohemian Rhapsody',
    artists: [{ id: '1', name: 'Queen' }]
  },
  {
    id: '2',
    name: 'Hotel California',
    artists: [{ id: '2', name: 'Eagles' }]
  },
  {
    id: '3',
    name: 'Imagine',
    artists: [{ id: '3', name: 'John Lennon' }]
  },
  {
    id: '4',
    name: 'Billie Jean',
    artists: [{ id: '4', name: 'Michael Jackson' }]
  },
  {
    id: '5',
    name: 'Like a Rolling Stone',
    artists: [{ id: '5', name: 'Bob Dylan' }]
  }
];

// Get Spotify OAuth URL
router.get('/auth-url', (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  const scope = 'user-read-private user-read-email user-top-read';
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state in session to verify later
  req.session.spotifyState = state;
  
  const authUrl = `https://accounts.spotify.com/authorize?` +
    `response_type=code` +
    `&client_id=${SPOTIFY_CLIENT_ID}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${state}`;
  
  res.json({ url: authUrl });
});

// Spotify callback
router.get('/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // Verify state matches to prevent CSRF
  if (!req.session.spotifyState || req.session.spotifyState !== state) {
    return res.status(400).json({ message: 'Invalid state' });
  }
  
  // Clear state
  delete req.session.spotifyState;
  
  try {
    // In a real implementation, exchange code for access and refresh tokens
    // Mock successful connection
    await storage.updateSpotifyConnection(req.session.userId, {
      spotifyConnected: true,
      // Token and refresh token would come from Spotify
      spotifyToken: 'mock-token',
      spotifyRefreshToken: 'mock-refresh-token'
    });
    
    // Store user top tracks
    await storage.saveUserTopTracks(req.session.userId, MOCK_TOP_TRACKS);
    
    // Redirect to frontend with success
    res.redirect('/profile?spotify=success');
  } catch (error) {
    // Redirect to frontend with error
    res.redirect('/profile?spotify=error');
  }
});

// Get user's top tracks
router.get('/top-tracks', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    const userId = req.session.userId;
    const user = await storage.getUser(userId);
    
    if (!user || !user.spotifyConnected) {
      return res.status(400).json({ message: 'Spotify not connected' });
    }
    
    const topTracks = await storage.getUserTopTracks(userId);
    
    // If no top tracks, use mock data
    if (!topTracks || topTracks.length === 0) {
      return res.json({ tracks: MOCK_TOP_TRACKS });
    }
    
    return res.json({ tracks: topTracks });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

// Find matches based on music taste
router.get('/music-matches', async (req, res) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  try {
    const userId = req.session.userId;
    const user = await storage.getUser(userId);
    
    if (!user || !user.spotifyConnected) {
      return res.status(400).json({ message: 'Spotify not connected' });
    }
    
    // Get music matches
    const matches = await storage.findMusicMatches(userId);
    
    return res.json({ matches });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
