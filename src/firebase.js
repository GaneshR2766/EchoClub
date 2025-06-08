// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔁 Replace these with your actual values from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDXvIvqefmeJ2wdpDtdDx5pDXsRg39LJR4",
  authDomain: "realtimechatapp-bcd4f.firebaseapp.com",
  projectId: "realtimechatapp-bcd4f",
  storageBucket: "realtimechatapp-bcd4f.firebasestorage.app",
  messagingSenderId: "854273862368",
  appId: "1:854273862368:web:1a210f9ce923f996bd7e85"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
