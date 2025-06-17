
import { initializeApp } from "firebase/app";
import {getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCeY2G3SUxD8j_bF9nz3hnO2ekzdz_WnVk",
  authDomain: "amenity-58943.firebaseapp.com",
  projectId: "amenity-58943",
  storageBucket: "amenity-58943.firebasestorage.app",
  messagingSenderId: "1005457671808",
  appId: "1:1005457671808:web:e9f46c8bf5c99769750865",
  measurementId: "G-FK91ZZJH3J"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db};