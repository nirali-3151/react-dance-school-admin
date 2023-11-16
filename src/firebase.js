import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId:process.env. REACT_APP_FIREBASE_MEASUREMENT_ID
  apiKey: "AIzaSyDKnJk0Kr0JchCR4uMp-NRknFxaeXTIZ6o",
  authDomain: "material-dashboard-fcf61.firebaseapp.com",
  projectId: "material-dashboard-fcf61",
  storageBucket: "material-dashboard-fcf61.appspot.com",
  messagingSenderId: "249064293833",
  appId: "1:249064293833:web:3a302a6f2d27910da49418",
  measurementId: "G-FLWSH64LXH"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

