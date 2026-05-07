import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDGmEg9mThDjylkLb4Buwm2tpQj3QTyeYY",
  authDomain: "yalu-tienda.firebaseapp.com",
  projectId: "yalu-tienda",
  storageBucket: "yalu-tienda.firebasestorage.app",
  messagingSenderId: "67182877314",
  appId: "1:67182877314:web:382bccfdf2bf030782b29b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();