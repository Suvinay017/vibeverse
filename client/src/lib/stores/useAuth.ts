import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  initializeFirebase
} from '../firebase';
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
          console.log('Attempting to sign in with email...');
          await signInWithEmailAndPassword(null, email, password);
          console.log('Firebase email login successful, now calling server login...');
          
          // After Firebase auth, call server to login and get user data
          await get().loginWithServer(email, password);
        } catch (error: any) {
          console.error('Login with email failed:', error);
          set({ error: error.message || 'Failed to login' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('Initializing Firebase before Google sign-in...');
          
          // Initialize Firebase and get the auth instance
          await initializeFirebase();
          
          console.log('Attempting to sign in with Google...');
          const result = await signInWithPopup(null, googleProvider);
          console.log('Google sign-in successful, processing user info...');
          
          const user = result.user;
          
          // After Google login, we need to either login or register on our server
          const email = user.email;
          const username = user.displayName || email?.split('@')[0] || 'user';
          
          console.log('Attempting server login with Google credentials...');
          
          // Try to login first, if it fails, sign up
          try {
            await get().loginWithServer(username, 'firebase-auth'); // Special password for firebase auth
          } catch (error) {
            console.log('Server login failed, attempting registration...');
            // If login fails, try to register
            await get().signupWithServer(
              username, 
              email || `${username}@example.com`, 
              'firebase-auth', 
              'firebase-auth'
            );
          }
          
          console.log('Google authentication process completed');
        } catch (error: any) {
          console.error('Login with Google failed:', error);
          set({ error: error.message || 'Failed to login with Google' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      signup: async (email, username, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log('Creating user with Firebase...');
          await createUserWithEmailAndPassword(null, email, password);
          console.log('Firebase user created, registering with server...');
          
          // After Firebase auth, call server to register and get user data
          await get().signupWithServer(username, email, password, password);
        } catch (error: any) {
          console.error('Signup failed:', error);
          set({ error: error.message || 'Failed to sign up' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('Signing out from Firebase...');
          await auth.signOut();
          console.log('Firebase sign out successful, logging out from server...');
          
          // Also logout from the server
          await apiRequest('POST', '/api/auth/logout');
          set({ user: null });
          console.log('Logout complete');
        } catch (error: any) {
          console.error('Logout failed:', error);
          set({ error: error.message || 'Failed to logout' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      // Server auth methods
      loginWithServer: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          console.log(`Logging in to server with username: ${username}`);
          const response = await apiRequest('POST', '/api/auth/login', { username, password });
          const userData = await response.json();
          console.log('Server login successful, user data received');
          set({ user: userData });
        } catch (error: any) {
          console.error('Server login failed:', error);
          set({ error: error.message || 'Failed to login' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      signupWithServer: async (username, email, password, confirmPassword) => {
        set({ isLoading: true, error: null });
        try {
          console.log(`Registering with server: ${username}, ${email}`);
          const response = await apiRequest('POST', '/api/auth/signup', {
            username,
            email,
            password,
            confirmPassword
          });
          const userData = await response.json();
          console.log('Server registration successful, user data received');
          set({ user: userData });
        } catch (error: any) {
          console.error('Server registration failed:', error);
          set({ error: error.message || 'Failed to sign up' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null });
        try {
          console.log('Fetching current user from server...');
          const response = await apiRequest('GET', '/api/auth/me');
          const userData = await response.json();
          console.log('Current user data received from server');
          set({ user: userData });
        } catch (error: any) {
          console.log('Failed to fetch current user, clearing user data');
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
