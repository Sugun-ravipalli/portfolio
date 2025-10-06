// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Data Engineering Portfolio Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD19g5JoR7d54Qd72qrCU3GCg8QqT0nzo8",
  authDomain: "sugun-de-portfolio.firebaseapp.com",
  projectId: "sugun-de-portfolio",
  storageBucket: "sugun-de-portfolio.firebasestorage.app",
  messagingSenderId: "1074713255915",
  appId: "1:1074713255915:web:17ea5488e61ff4680343ae",
  measurementId: "G-0DRJR4LDC2"
};

console.log('Initializing Data Engineering Portfolio Firebase with config:', {
  apiKey: firebaseConfig.apiKey ? '***' : 'MISSING',
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
  measurementId: firebaseConfig.measurementId
});

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'data-engineering-portfolio');
console.log('Data Engineering Portfolio Firebase app initialized successfully');

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

console.log('Data Engineering Portfolio Firebase services initialized:', {
  auth: !!auth,
  db: !!db,
  storage: !!storage,
  analytics: !!analytics
});

// Export the services
export { auth, db, storage, analytics };
export default app;
