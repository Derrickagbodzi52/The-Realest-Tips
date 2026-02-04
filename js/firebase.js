import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaBJr6BgeqkkYouIGkGyTErdCSJgDFJBw",
  authDomain: "the-realest-tips-13d93.firebaseapp.com",
  projectId: "the-realest-tips-13d93",
  storageBucket: "the-realest-tips-13d93.firebasestorage.app",
  messagingSenderId: "890505295922",
  appId: "1:890505295922:web:9bbda46226cb56b0d0a42b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);