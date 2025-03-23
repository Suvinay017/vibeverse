import { users, type User, type InsertUser, messages, matches, userTopTracks } from "@shared/schema";
import type { Message, Match, SpotifyTrack } from "@shared/types";

export interface IStorage {
  // User functions
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Spotify functions
  updateSpotifyConnection(userId: number, data: any): Promise<User | undefined>;
  saveUserTopTracks(userId: number, tracks: SpotifyTrack[]): Promise<void>;
  getUserTopTracks(userId: number): Promise<SpotifyTrack[]>;
  
  // Matching functions
  findMusicMatches(userId: number): Promise<{user: User, score: number}[]>;
  findVibeMatches(userId: number): Promise<{user: User, score: number}[]>;
  createMatch(userId1: number, userId2: number, score: number): Promise<Match>;
  getMatches(userId: number): Promise<Match[]>;
  updateMatchStatus(matchId: number, status: string): Promise<Match | undefined>;
  
  // Messaging functions
  getMessages(userId1: number, userId2: number): Promise<Message[]>;
  createMessage(message: { senderId: number, receiverId: number, content: string }): Promise<Message>;
  markMessagesAsRead(senderId: number, receiverId: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private matches: Map<number, Match>;
  private userTracks: Map<number, { userId: number, tracks: SpotifyTrack[] }>;
  
  currentUserId: number;
  currentMessageId: number;
  currentMatchId: number;
  currentTrackId: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.matches = new Map();
    this.userTracks = new Map();
    
    this.currentUserId = 1;
    this.currentMessageId = 1;
    this.currentMatchId = 1;
    this.currentTrackId = 1;
  }

  // USER METHODS
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      spotifyConnected: false,
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = {...user, ...userData};
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // SPOTIFY METHODS
  async updateSpotifyConnection(userId: number, data: any): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = {...user, ...data};
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async saveUserTopTracks(userId: number, tracks: SpotifyTrack[]): Promise<void> {
    this.userTracks.set(this.currentTrackId++, { userId, tracks });
  }
  
  async getUserTopTracks(userId: number): Promise<SpotifyTrack[]> {
    const userTrackEntry = Array.from(this.userTracks.values()).find(entry => entry.userId === userId);
    return userTrackEntry?.tracks || [];
  }
  
  // MATCHING METHODS
  async findMusicMatches(userId: number): Promise<{user: User, score: number}[]> {
    const user = await this.getUser(userId);
    if (!user) return [];
    
    const userTracks = await this.getUserTopTracks(userId);
    if (userTracks.length === 0) return [];
    
    const matches: {user: User, score: number}[] = [];
    
    // Get all users except current user
    const otherUsers = Array.from(this.users.values())
      .filter(otherUser => otherUser.id !== userId && otherUser.spotifyConnected);
    
    for (const otherUser of otherUsers) {
      const otherUserTracks = await this.getUserTopTracks(otherUser.id);
      if (otherUserTracks.length === 0) continue;
      
      // Calculate match score based on common tracks/artists
      let score = 0;
      
      // Check for common tracks
      for (const track of userTracks) {
        if (otherUserTracks.some(t => t.id === track.id)) {
          score += 10; // 10 points for same track
        } else {
          // Check for common artists
          for (const artist of track.artists) {
            if (otherUserTracks.some(t => t.artists.some(a => a.id === artist.id))) {
              score += 5; // 5 points for same artist
            }
          }
        }
      }
      
      // Normalize score to 0-100
      const normalizedScore = Math.min(100, score);
      
      matches.push({
        user: otherUser,
        score: normalizedScore
      });
    }
    
    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  }
  
  async findVibeMatches(userId: number): Promise<{user: User, score: number}[]> {
    const user = await this.getUser(userId);
    if (!user || !user.vibes || user.vibes.length === 0) return [];
    
    const matches: {user: User, score: number}[] = [];
    
    // Get all users except current user
    const otherUsers = Array.from(this.users.values())
      .filter(otherUser => otherUser.id !== userId && otherUser.vibes && otherUser.vibes.length > 0);
    
    for (const otherUser of otherUsers) {
      if (!otherUser.vibes) continue;
      
      // Calculate match score based on common vibes
      let score = 0;
      
      // Count matching vibes
      for (const vibe of user.vibes) {
        if (otherUser.vibes.includes(vibe)) {
          score += 20; // 20 points for each matching vibe
        }
      }
      
      // Normalize score to 0-100
      const normalizedScore = Math.min(100, score);
      
      matches.push({
        user: otherUser,
        score: normalizedScore
      });
    }
    
    // Sort by score descending
    return matches.sort((a, b) => b.score - a.score);
  }
  
  async createMatch(userId1: number, userId2: number, score: number): Promise<Match> {
    const id = this.currentMatchId++;
    const now = new Date();
    
    const match: Match = {
      id,
      userId1,
      userId2,
      score,
      status: 'pending',
      createdAt: now
    };
    
    this.matches.set(id, match);
    return match;
  }
  
  async getMatches(userId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.userId1 === userId || match.userId2 === userId
    );
  }
  
  async updateMatchStatus(matchId: number, status: string): Promise<Match | undefined> {
    const match = this.matches.get(matchId);
    if (!match) return undefined;
    
    const updatedMatch = {...match, status};
    this.matches.set(matchId, updatedMatch);
    return updatedMatch;
  }
  
  // MESSAGING METHODS
  async getMessages(userId1: number, userId2: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(
        message => 
          (message.senderId === userId1 && message.receiverId === userId2) ||
          (message.senderId === userId2 && message.receiverId === userId1)
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
  
  async createMessage(messageData: { senderId: number, receiverId: number, content: string }): Promise<Message> {
    const id = this.currentMessageId++;
    const now = new Date();
    
    const message: Message = {
      id,
      ...messageData,
      timestamp: now,
      read: false
    };
    
    this.messages.set(id, message);
    return message;
  }
  
  async markMessagesAsRead(senderId: number, receiverId: number): Promise<void> {
    const messagesToUpdate = Array.from(this.messages.values())
      .filter(
        message => message.senderId === senderId && message.receiverId === receiverId && !message.read
      );
    
    for (const message of messagesToUpdate) {
      const updatedMessage = {...message, read: true};
      this.messages.set(message.id, updatedMessage);
    }
  }
}

export const storage = new MemStorage();
