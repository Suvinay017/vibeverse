import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from '../firebase';
import { apiRequest } from '../queryClient';
import type { User } from '@shared/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Firebase auth methods
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Server auth methods
  loginWithServer: (username: string, password: string) => Promise<void>;
  signupWithServer: (username: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
  
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      
      // Firebase auth methods
      loginWithEmail: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          await signInWithEmailAndPassword(auth, email, password);
          // After Firebase auth, call server to login and get user data
          await get().loginWithServer(email, password);
        } catch (error: any) {
          set({ error: error.message || 'Failed to login' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          
          // After Google login, we need to either login or register on our server
          // using the Google user info
          const email = user.email;
          const username = user.displayName || email?.split('@')[0] || 'user';
          
          // Try to login first, if it fails, sign up
          try {
            await get().loginWithServer(username, 'firebase-auth'); // Special password for firebase auth
          } catch (error) {
            // If login fails, try to register
            await get().signupWithServer(username, email || `${username}@example.com`, 'firebase-auth', 'firebase-auth');
          }
        } catch (error: any) {
          set({ error: error.message || 'Failed to login with Google' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      signup: async (email, username, password) => {
        set({ isLoading: true, error: null });
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          // After Firebase auth, call server to register and get user data
          await get().signupWithServer(username, email, password, password);
        } catch (error: any) {
          set({ error: error.message || 'Failed to sign up' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await auth.signOut();
          // Also logout from the server
          await apiRequest('POST', '/api/auth/logout');
          set({ user: null });
        } catch (error: any) {
          set({ error: error.message || 'Failed to logout' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Server auth methods
      loginWithServer: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiRequest('POST', '/api/auth/login', { username, password });
          const userData = await response.json();
          set({ user: userData });
        } catch (error: any) {
          set({ error: error.message || 'Failed to login' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      signupWithServer: async (username, email, password, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiRequest('POST', '/api/auth/signup', {
            username,
            email,
            password,
            confirmPassword
          });
          const userData = await response.json();
          set({ user: userData });
        } catch (error: any) {
          set({ error: error.message || 'Failed to sign up' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiRequest('GET', '/api/auth/me');
          const userData = await response.json();
          set({ user: userData });
        } catch (error: any) {
          // Just clear user if there's an error
          set({ user: null });
        } finally {
          set({ isLoading: false });
        }
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ user: state.user }) // only persist the user
    }
  )
);
