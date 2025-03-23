import { initializeApp, FirebaseApp } from "firebase/app";
import { 
  getAuth as getFirebaseAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  Auth
} from "firebase/auth";

// Create placeholder values that will be filled during initialization
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let isInitialized = false;

// Initialize Firebase with config from server
async function initializeFirebase() {
  if (isInitialized) return true;
  
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
    auth = getFirebaseAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    // Set language and custom parameters
    if (auth) {
      auth.languageCode = 'en';
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
    }
    
    isInitialized = true;
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
const getAuthInstance = async () => {
  if (!auth) {
    await initializeFirebase();
    if (!auth) {
      throw new Error('Firebase auth not initialized. Wait for initialization to complete.');
    }
  }
  return auth;
};

const getGoogleProviderInstance = async () => {
  if (!googleProvider) {
    await initializeFirebase();
    if (!googleProvider) {
      throw new Error('Firebase Google provider not initialized. Wait for initialization to complete.');
    }
  }
  return googleProvider;
};

export { 
  getAuthInstance as auth, 
  getGoogleProviderInstance as googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  initializeFirebase
};
