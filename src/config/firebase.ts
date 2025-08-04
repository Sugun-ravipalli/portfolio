// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC8xDoXESXN46BFIDGUU2Af51BVa8odC2c",
  authDomain: "photography-portfolio-f3214.firebaseapp.com",
  projectId: "photography-portfolio-f3214",
  storageBucket: "photography-portfolio-f3214.firebasestorage.app",
  messagingSenderId: "753542479062",
  appId: "1:753542479062:web:cb9132427d02785849dd77",
  measurementId: "G-62PJCYMCDG"
};

console.log('Initializing Firebase with config:', {
  apiKey: firebaseConfig.apiKey ? '***' : 'MISSING',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase app initialized successfully');

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Only initialize analytics in production
let analytics = null;
if (process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

console.log('Firebase services initialized:', {
  auth: !!auth,
  db: !!db,
  storage: !!storage,
  analytics: !!analytics
});

// Export the services
export { auth, db, storage, analytics };
export default app; 