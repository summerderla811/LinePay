
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGFTudQOx3uJL_3q_1m53NYD_A8t53pO0",
  authDomain: "linepayledger.firebaseapp.com",
  projectId: "linepayledger",
  storageBucket: "linepayledger.firebasestorage.app",
  messagingSenderId: "434174326821",
  appId: "1:434174326821:web:a16097a922213a219627cc"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
