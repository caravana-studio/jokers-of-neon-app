import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCfd16J9oY3wGXPrSZ6iaGk3gNCb1oPDhM",
  authDomain: "jokersofneon-1bedd.firebaseapp.com",
  projectId: "jokersofneon-1bedd",
  storageBucket: "jokersofneon-1bedd.firebasestorage.app",
  messagingSenderId: "225840009580",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

export const firebaseApp = initializeApp(firebaseConfig);
