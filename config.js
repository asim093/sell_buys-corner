import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut , createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getStorage ,  ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getDocs , collection, addDoc , getFirestore  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js"; 

const firebaseConfig = {
  apiKey: "AIzaSyBjj2rIb5Gi00OG9ZulavfaSvmd6P3WkeI",
  authDomain: "buy-sell-corner-6dc98.firebaseapp.com",
  projectId: "buy-sell-corner-6dc98",
  storageBucket: "buy-sell-corner-6dc98.appspot.com",
  messagingSenderId: "646801019559",
  appId: "1:646801019559:web:b782aa14068da376e30182",
  measurementId: "G-DF5FFPRP6Y"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { onAuthStateChanged, signOut , getDocs , createUserWithEmailAndPassword , collection, addDoc , ref, uploadBytes, getDownloadURL , getStorage };
  
