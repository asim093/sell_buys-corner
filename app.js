import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { auth } from './config.js';


let form = document.getElementById('registerForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        swal({
            title: "User Registration",
            text: "User registration successful",
            icon: "success",
            button: "Ok",
        }).then(() => {
            window.location = 'home.html';
        });
    } catch (error) {
        swal({
            title: "User Registration Failed",
            text: error.message,
            icon: "error",
            button: "Ok",
        });
        console.log(error);
    }

    
});
