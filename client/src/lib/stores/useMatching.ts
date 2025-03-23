import { create } from 'zustand';
import { apiRequest } from '../queryClient';
import type { User, Match } from '@shared/types';

interface MatchWithUser extends Match {
  matchedUser?: User; // The other user in the match
}

interface MatchState {
  vibeMatches: { user: User; score: number }[];
  musicMatches: { user: User; score: number }[];
  userMatches: MatchWithUser[];
  isLoading: boolean;
  error: string | null;
  
  fetchVibeMatches: () => Promise<void>;
  fetchMusicMatches: () => Promise<void>;
  fetchUserMatches: () => Promise<void>;
  acceptMatch: (matchId: number) => Promise<void>;
  rejectMatch: (matchId: number) => Promise<void>;
  clearError: () => void;
}

export const useMatching = create<MatchState>((set, get) => ({
  vibeMatches: [],
  musicMatches: [],
  userMatches: [],
  isLoading: false,
  error: null,
  
  fetchVibeMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('GET', '/api/matches/vibe');
      const matches = await response.json();
      set({ vibeMatches: matches });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch vibe matches' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchMusicMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('GET', '/api/spotify/music-matches');
      const { matches } = await response.json();
      set({ musicMatches: matches });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch music matches' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchUserMatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('GET', '/api/matches');
      const matches = await response.json();
      
      // Get details for each matched user
      const userMatches: MatchWithUser[] = [];
      
      for (const match of matches) {
        try {
          // Get the other user ID (not the current user)
          const userId = match.userId1 === get().currentUserId
            ? match.userId2
            : match.userId1;
            
          const userResponse = await apiRequest('GET', `/api/users/${userId}`);
          const matchedUser = await userResponse.json();
          
          userMatches.push({
            ...match,
            matchedUser
          });
        } catch (error) {
          console.error("Failed to fetch user details for match", error);
          userMatches.push(match);
        }
      }
      
      set({ userMatches });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch user matches' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  acceptMatch: async (matchId) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest('PUT', `/api/matches/${matchId}`, { status: 'accepted' });
      await get().fetchUserMatches(); // Refresh the matches
    } catch (error: any) {
      set({ error: error.message || 'Failed to accept match' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  rejectMatch: async (matchId) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest('PUT', `/api/matches/${matchId}`, { status: 'rejected' });
      await get().fetchUserMatches(); // Refresh the matches
    } catch (error: any) {
      set({ error: error.message || 'Failed to reject match' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearError: () => set({ error: null }),
  
  // Helper property to get the current user ID
  get currentUserId(): number | undefined {
    return window.__USER_ID__; // This should be set when the app initializes
  }
}));
