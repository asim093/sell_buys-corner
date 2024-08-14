import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { auth, db , checkAuthStateAndLoadProfile } from './config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const form = document.getElementById('registerForm');
const profileImage = document.getElementById('profile-view');

// checkAuthStateAndLoadProfile(auth, db, profileImage);


form.addEventListener('submit', async (event) => {
    checkAuthStateAndLoadProfile(auth, db, profileImage);
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const bodyLoader = document.querySelector('.bg-gray-100');

    bodyLoader.innerHTML = `
    <div class="loader-container fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <span class="loading loading-dots w-24 h-24"></span>
    </div>
    `;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Hide the loader
        bodyLoader.innerHTML = '';

        swal({
            title: "User Registration",
            text: "User Login successful",
            icon: "success",
            button: "Ok",
        }).then(() => {
            window.location = 'index.html';
        });
    } catch (error) {
        swal({
            title: "User Registration Failed",
            text: error.message,
            icon: "error",
            button: "Ok",
        }).then(()=>{
            console.error(error);

            bodyLoader.innerHTML = '';
            window.location = 'login.html';
        });
        
    }
});
