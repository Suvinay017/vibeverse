import { create } from 'zustand';
import { apiRequest } from '../queryClient';
import type { AvatarConfig } from '@shared/types';
import { useAuth } from './useAuth';

interface ProfileState {
  isUpdating: boolean;
  error: string | null;
  
  updateProfile: (data: {
    bio?: string;
    avatarConfig?: AvatarConfig;
    vibes?: string[];
  }) => Promise<void>;
  
  clearError: () => void;
}

export const useProfile = create<ProfileState>((set) => ({
  isUpdating: false,
  error: null,
  
  updateProfile: async (data) => {
    set({ isUpdating: true, error: null });
    try {
      const response = await apiRequest('PUT', '/api/users/profile', data);
      const updatedUser = await response.json();
      
      // Update the user in auth store
      useAuth.setState({ user: updatedUser });
    } catch (error: any) {
      set({ error: error.message || 'Failed to update profile' });
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },
  
  clearError: () => set({ error: null })
}));

// Available vibe categories
export const vibeCategories = [
  {
    id: 'music',
    name: 'Music',
    tags: ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'EDM', 'Classical', 'Country', 'R&B', 'Alternative', 'Metal', 'Indie', 'Folk']
  },
  {
    id: 'hobbies',
    name: 'Hobbies',
    tags: ['Gaming', 'Reading', 'Cooking', 'Hiking', 'Photography', 'Painting', 'Writing', 'Dancing', 'Singing', 'Crafting', 'Collecting', 'Gardening']
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    tags: ['Fitness', 'Foodie', 'Travel', 'Minimalist', 'Eco-friendly', 'Spiritual', 'Luxury', 'DIY', 'Adventure', 'Homebody', 'Night Owl', 'Early Bird']
  },
  {
    id: 'aesthetic',
    name: 'Aesthetic',
    tags: ['Vintage', 'Modern', 'Cyberpunk', 'Cottagecore', 'Goth', 'Y2K', 'Streetwear', 'Glam', 'Boho', 'Retro', 'Anime', 'Punk']
  },
  {
    id: 'personality',
    name: 'Personality',
    tags: ['Introvert', 'Extrovert', 'Ambitious', 'Laid-back', 'Creative', 'Analytical', 'Empathetic', 'Independent', 'Adventurous', 'Organized', 'Spontaneous', 'Philosophical']
  }
];
