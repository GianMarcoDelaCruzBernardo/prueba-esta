export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDGmEg9mThDjylkLb4Buwm2tpQj3QTyeYY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "yalu-tienda.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "yalu-tienda",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "yalu-tienda.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "67182877314",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:67182877314:web:382bccfdf2bf030782b29b",
};

export const HCAPTCHA_SITEKEY =
  import.meta.env.VITE_HCAPTCHA_SITEKEY || "702220f6-72ac-4296-b5c2-cece0b069960";

export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "51900548662";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";
