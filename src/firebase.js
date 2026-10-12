
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyAH4gEHvchFDpMPnEFo2J9TDZlcbv982V0",
  authDomain: "inventory-management-sys-1a1ee.firebaseapp.com",
  projectId: "inventory-management-sys-1a1ee",
  storageBucket: "inventory-management-sys-1a1ee.firebasestorage.app",
  messagingSenderId: "960350578601",
  appId: "1:960350578601:web:089173430f68dff81506b8"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

//Inventory management system React apps firebase connection file is created
