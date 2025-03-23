import { create } from 'zustand';
import { apiRequest } from '../queryClient';
import type { SpotifyTrack } from '@shared/types';

interface SpotifyState {
  isConnected: boolean;
  topTracks: SpotifyTrack[];
  authUrl: string | null;
  isLoading: boolean;
  error: string | null;
  
  getAuthUrl: () => Promise<void>;
  fetchTopTracks: () => Promise<void>;
  clearError: () => void;
}

export const useSpotify = create<SpotifyState>((set) => ({
  isConnected: false,
  topTracks: [],
  authUrl: null,
  isLoading: false,
  error: null,
  
  getAuthUrl: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('GET', '/api/spotify/auth-url');
      const { url } = await response.json();
      set({ authUrl: url });
    } catch (error: any) {
      set({ error: error.message || 'Failed to get Spotify auth URL' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchTopTracks: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('GET', '/api/spotify/top-tracks');
      const { tracks } = await response.json();
      set({ topTracks: tracks, isConnected: true });
    } catch (error: any) {
      if (error.message.includes('401') || error.message.includes('Spotify not connected')) {
        set({ isConnected: false });
      } else {
        set({ error: error.message || 'Failed to fetch top tracks' });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  
  clearError: () => set({ error: null })
}));
