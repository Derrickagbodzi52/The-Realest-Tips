import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// REGISTER
window.register = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Registration successful");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

// LOGIN
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successful");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

// LOGOUT
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
};

// PROTECT VVIP PAGES
window.checkVIP = function () {
  onAuthStateChanged(auth, user => {
    if (!user) {
      alert("Please login to access VVIP");
      window.location.href = "login.html";
      return;
    }
    // If user logged in, verify subscription with backend using ID token
    user.getIdToken().then(token => {
      fetch('http://localhost:5000/api/subscription', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token }
      })
      .then(res => res.json())
      .then(data => {
        if (!data.subscribed) {
          alert('You are not subscribed to VVIP. Please proceed to payment.');
          window.location.href = 'success.html';
        }
      })
      .catch(err => {
        console.error('Subscription check failed:', err);
        alert('Failed to verify subscription. Please try again later.');
      });
    }).catch(err => {
      console.error('Failed to get ID token for subscription check:', err);
      alert('Authentication error. Please login again.');
      window.location.href = 'login.html';
    });
  });
};