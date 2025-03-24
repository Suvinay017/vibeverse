import { initializeApp } from "firebase/app";
import { 
  getAuth,
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  createUserWithEmailAndPassword as firebaseCreateUser,
  signInWithPopup as firebaseSignInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";

// Declare a variable to track initialization status
let isInitialized = false;

// Create a Google Auth Provider instance
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Declare a variable to hold the Firebase app and auth instances
let firebaseApp: any;
let firebaseAuth: any;

// Initialize Firebase with config from server
async function initializeFirebase() {
  if (isInitialized) return { auth: firebaseAuth, provider: googleProvider };
  
  try {
    console.log('Fetching Firebase configuration...');
    const response = await fetch('/api/config/firebase');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Firebase config: ${response.statusText}`);
    }
    
    const firebaseConfig = await response.json();
    console.log('Firebase config received:', Object.keys(firebaseConfig).join(', '));
    
    // Check if config has required fields
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      console.error('Firebase configuration is incomplete:', firebaseConfig);
      throw new Error('Firebase configuration is incomplete');
    }
    
    // Initialize Firebase
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
    
    if (firebaseAuth) {
      firebaseAuth.languageCode = 'en';
      console.log('Firebase Auth initialized successfully');
      isInitialized = true;
      return { auth: firebaseAuth, provider: googleProvider };
    } else {
      throw new Error('Firebase Auth initialization failed');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

// Wrapped authentication functions that ensure Firebase is initialized
async function signInWithEmailAndPassword(auth: any, email: string, password: string) {
  const { auth: firebaseAuth } = await initializeFirebase();
  return firebaseSignInWithEmail(firebaseAuth, email, password);
}

async function createUserWithEmailAndPassword(auth: any, email: string, password: string) {
  const { auth: firebaseAuth } = await initializeFirebase();
  return firebaseCreateUser(firebaseAuth, email, password);
}

async function signInWithPopup(auth: any, provider: any) {
  const { auth: firebaseAuth, provider: googleProviderInstance } = await initializeFirebase();
  return firebaseSignInWithPopup(firebaseAuth, googleProviderInstance);
}

// Initialize Firebase when the module is loaded
initializeFirebase().catch(err => {
  console.error('Failed to initialize Firebase:', err);
});

// Export the auth object and authentication functions
export { 
  initializeFirebase,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider
};

// Export a getter for the auth object
export const auth = {
  signOut: async () => {
    try {
      const { auth: firebaseAuth } = await initializeFirebase();
      return firebaseAuth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
};
