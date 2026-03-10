import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- AUTHENTICATION FUNCTIONS ---

// REGISTER
window.register = function () {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) return alert("Please fill in all fields");

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

// LOGIN
window.login = function () {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password) return alert("Please fill in all fields");

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

// LOGOUT
window.logout = function () {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  }).catch(err => console.error("Logout error:", err));
};

// --- UI SYNC ---
onAuthStateChanged(auth, (user) => {
  const authButtons = document.getElementById("auth-buttons");
  const userMenu = document.getElementById("user-menu");
  const userEmail = document.getElementById("user-email");

  if (user) {
    if (authButtons) authButtons.classList.add("hidden");
    if (userMenu) userMenu.classList.remove("hidden");
    if (userEmail) userEmail.textContent = user.email;
  } else {
    if (authButtons) authButtons.classList.remove("hidden");
    if (userMenu) userMenu.classList.add("hidden");
    if (userEmail) userEmail.textContent = "";
  }
});

// --- VIP PROTECTION (FIXED: NO AUTO-REDIRECT) ---
window.checkVIP = function () {
  onAuthStateChanged(auth, user => {
    if (!user) {
      // No user logged in? We stay on the page so they see the "Login" button.
      console.log("Accessing locked content: No user logged in.");
    } else {
      // User is logged in, now check backend for subscription
      user.getIdToken().then(token => {
        // Ensure your server is running on port 5000
        fetch('http://localhost:5000/api/subscription', {
          method: 'GET',
          headers: { 'Authorization': 'Bearer ' + token }
        })
        .then(res => res.json())
        .then(data => {
          if (data.subscribed) {
            // User IS a VIP. You can redirect them to the real tips page 
            // or toggle a hidden class to show the data.
            console.log("User is a valid VIP subscriber.");
          } else {
            // User is NOT a VIP. We stay on the current page.
            // This allows them to see the background image and the Subscribe button.
            console.log("User is logged in but has no active subscription.");
          }
        })
        .catch(err => {
          console.error('Subscription check failed:', err);
          // If server is down, we stay on the page as a fallback.
        });
      });
    }
  });
};