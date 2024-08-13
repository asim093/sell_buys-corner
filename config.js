import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js";
import { getDocs, collection, addDoc, getFirestore, query, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// Firebase configuration
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

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const profileImage = document.getElementById('profile-view');

export function checkAuthStateAndLoadProfile() {
    onAuthStateChanged(auth, async (user) => {
        const currentPath = window.location.pathname;
        
        if (!user) {
            if (currentPath === '/postad.html' || currentPath === '/singleproduct.html') {
                window.location.href = 'login.html';
            }
        } else {
            // User is authenticated
            if (profileImage) {
                try {
                    const uid = user.uid;
                    const q = query(collection(db, "users"), where("uid", "==", uid));
                    const querySnapshot = await getDocs(q);
                    
                    querySnapshot.forEach((doc) => {
                        let data = doc.data();
                        profileImage.src = data.imageLink; 
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        }
    });
}

export { auth, db, storage, getStorage, onAuthStateChanged, signOut, createUserWithEmailAndPassword, getDocs, collection, addDoc, ref, uploadBytes, getDownloadURL };
