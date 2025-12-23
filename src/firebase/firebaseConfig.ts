import { initializeApp } from "firebase/app";

// Optionally import the services that you want to use
//import { getAuth } from "firebase/auth";
// import {...} from 'firebase/database';
import { getFirestore } from "firebase/firestore";
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAVuV51BFCtJOjGRm3kgrX3mS0vJJF5bGU",
  authDomain: "murmur-expo-react-native.firebaseapp.com",
  projectId: "murmur-expo-react-native",
  storageBucket: "murmur-expo-react-native.firebasestorage.app",
  messagingSenderId: "87425463550",
  appId: "1:87425463550:web:84c2a7779b93b04d8221af",
  measurementId: "G-H4PNJWCND7",
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
export const db = getFirestore(app);

export default app;
