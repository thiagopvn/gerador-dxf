import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDJfW9jfLM9BU2brzlgn3vGWc8f6KDmJWY',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'remarcacao-chassi.firebaseapp.com',
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 'https://remarcacao-chassi-default-rtdb.firebaseio.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'remarcacao-chassi',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'remarcacao-chassi.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '932800257478',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:932800257478:web:f6de694839f17ae31f66c7',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-G6TL86TYBN'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;