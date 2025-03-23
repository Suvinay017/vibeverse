// Types shared between client and server

export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatarConfig?: AvatarConfig;
  vibes?: string[];
  spotifyId?: string;
  spotifyConnected: boolean;
  createdAt: Date;
}

export interface AvatarConfig {
  hairStyle: number;
  hairColor: string;
  skinTone: string;
  eyeColor: string;
  outfit: number;
  accessories: number[];
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Match {
  id: number;
  userId1: number;
  userId2: number;
  score: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  imageUrl?: string;
}

export interface EnvironmentConfig {
  id: string;
  name: string;
  type: 'cafe' | 'street' | 'abandoned';
  description: string;
}

export interface VibeCategory {
  id: string;
  name: string;
  description: string;
  tags: string[];
}
