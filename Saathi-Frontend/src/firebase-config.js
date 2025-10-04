// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB82DS73HMp7C2-jH7CbzHrZj9n7cXTQ4E",
  authDomain: "saathi-auth.firebaseapp.com",
  projectId: "saathi-auth",
  storageBucket: "saathi-auth.firebasestorage.app",
  messagingSenderId: "937516733557",
  appId: "1:937516733557:web:d6a22ecb4e957eb187d43c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;