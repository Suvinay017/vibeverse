import { create } from 'zustand';
import { apiRequest } from '../queryClient';
import type { Message, User } from '@shared/types';

interface MessagesState {
  messages: Message[];
  selectedUserId: number | null;
  chatPartners: User[];
  isLoading: boolean;
  error: string | null;
  
  fetchMessages: (userId: number) => Promise<void>;
  fetchChatPartners: () => Promise<void>;
  sendMessage: (userId: number, content: string) => Promise<void>;
  selectUser: (userId: number) => void;
  clearError: () => void;
}

export const useMessages = create<MessagesState>((set, get) => ({
  messages: [],
  selectedUserId: null,
  chatPartners: [],
  isLoading: false,
  error: null,
  
  fetchMessages: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiRequest('GET', `/api/messages/${userId}`);
      const messages = await response.json();
      set({ messages, selectedUserId: userId });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch messages' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchChatPartners: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, we would have an endpoint to get chat partners
      // For now, we'll use a mock implementation
      
      // First, get all matches that are accepted
      const matchesResponse = await apiRequest('GET', '/api/matches');
      const matches = await matchesResponse.json();
      const acceptedMatches = matches.filter((match: any) => match.status === 'accepted');
      
      // For each match, get the other user
      const chatPartners: User[] = [];
      
      for (const match of acceptedMatches) {
        // Determine which user ID is not the current user
        const otherUserId = match.userId1 === window.__USER_ID__ 
          ? match.userId2 
          : match.userId1;
          
        // Fetch the user details
        const userResponse = await apiRequest('GET', `/api/users/${otherUserId}`);
        const user = await userResponse.json();
        chatPartners.push(user);
      }
      
      set({ chatPartners });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch chat partners' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  sendMessage: async (userId, content) => {
    set({ isLoading: true, error: null });
    try {
      await apiRequest('POST', '/api/messages', {
        receiverId: userId,
        content
      });
      
      // Refetch messages to get the new one
      await get().fetchMessages(userId);
    } catch (error: any) {
      set({ error: error.message || 'Failed to send message' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  selectUser: (userId) => {
    set({ selectedUserId: userId });
    get().fetchMessages(userId);
  },
  
  clearError: () => set({ error: null })
}));
