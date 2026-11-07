import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDT6a_zJzAKQ0DOR_P63JtOzt1-eRybNt4",
  authDomain: "toteshirt-india-53c11.firebaseapp.com",
  projectId: "toteshirt-india-53c11",
  storageBucket: "toteshirt-india-53c11.firebasestorage.app",
  messagingSenderId: "319410814892",
  appId: "1:319410814892:web:069bada3364ac77ded4409",
  measurementId: "G-5YFR5VL45Y"
};
const auth = getAuth(initializeApp(firebaseConfig));
const authScreen = document.getElementById("authScreen");
const mainWebsite = document.getElementById("mainWebsite");
const authForm = document.getElementById("authForm");
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const authTitle = document.getElementById("authTitle");
const authButton = document.getElementById("authButton");
const nameGroup = document.getElementById("nameGroup");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const logoutButton = document.getElementById("logoutButton");
const authMessage = document.getElementById("authMessage");
const resetPasswordButton = document.getElementById("resetPasswordButton");
let currentMode = "login";

function setMessage(text, error = false) {
  authMessage.textContent = text;
  authMessage.style.color = error ? "#b42318" : "";
}
function showWebsite() {
  authScreen.style.display = "none";
  mainWebsite.style.display = "block";
  window.scrollTo({ top: 0, behavior: "instant" });
}
function showLogin() {
  authScreen.style.display = "grid";
  mainWebsite.style.display = "none";
  window.scrollTo({ top: 0, behavior: "instant" });
}
function setMode(mode) {
  currentMode = mode;
  const signup = mode === "signup";
  loginTab.classList.toggle("active", !signup);
  signupTab.classList.toggle("active", signup);
  authTitle.textContent = signup ? "Create your account" : "Welcome back";
  authButton.textContent = signup ? "Create account" : "Log in";
  nameGroup.style.display = signup ? "block" : "none";
  nameInput.required = signup;
  passwordInput.autocomplete = signup ? "new-password" : "current-password";
  setMessage(" ");
}
loginTab.addEventListener("click", () => setMode("login"));
signupTab.addEventListener("click", () => setMode("signup"));

authForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const name = nameInput.value.trim();
  authButton.disabled = true;
  setMessage(currentMode === "signup" ? "Creating your account…" : "Signing you in…");
  try {
    if (currentMode === "signup") {
      if (!name) throw new Error("Please enter your name.");
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch (error) {
    const friendly = {
      "auth/email-already-in-use": "This email already has an account. Please log in.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/weak-password": "Choose a password with at least 6 characters.",
      "auth/invalid-credential": "Email or password is incorrect.",
      "auth/user-not-found": "No account found. Please sign up first.",
      "auth/too-many-requests": "Too many attempts. Please wait and try again.",
      "auth/network-request-failed": "Network error. Check your connection."
    };
    setMessage(friendly[error.code] || error.message || "Something went wrong. Please try again.", true);
  } finally {
    authButton.disabled = false;
  }
});
resetPasswordButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) {
    setMessage("Enter your email address first.", true);
    emailInput.focus();
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    setMessage("Password reset email sent. Check your inbox.");
  } catch (error) {
    setMessage(error.message || "Could not send the reset email.", true);
  }
});
logoutButton.addEventListener("click", async () => {
  try {
    await signOut(auth);
    authForm.reset();
    setMode("login");
  } catch (error) {
    setMessage("Could not log out. Please try again.", true);
  }
});
onAuthStateChanged(auth, (user) => user ? showWebsite() : showLogin());
