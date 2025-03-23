import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  Auth
} from "firebase/auth";

// Create placeholder values that will be filled during initialization
let app: FirebaseApp;
let auth: Auth;
let googleProvider: GoogleAuthProvider;

// Initialize Firebase with config from server
async function initializeFirebase() {
  try {
    const response = await fetch('/api/config/firebase');
    if (!response.ok) {
      throw new Error(`Failed to fetch Firebase config: ${response.statusText}`);
    }
    
    const firebaseConfig = await response.json();
    
    // Verify we have the required fields
    if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
      throw new Error('Firebase configuration is incomplete');
    }
    
    // Initialize Firebase with the retrieved config
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Set language and custom parameters
    auth.languageCode = 'en';
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    console.log('Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    return false;
  }
}

// Initialize Firebase when the module is loaded
initializeFirebase().catch(err => {
  console.error('Failed to initialize Firebase:', err);
});

// Safe getters for auth objects that ensure they are initialized
const getAuth = () => {
  if (!auth) {
    throw new Error('Firebase auth not initialized. Wait for initialization to complete.');
  }
  return auth;
};

const getGoogleProvider = () => {
  if (!googleProvider) {
    throw new Error('Firebase Google provider not initialized. Wait for initialization to complete.');
  }
  return googleProvider;
};

export { 
  getAuth as auth, 
  getGoogleProvider as googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  initializeFirebase
};
