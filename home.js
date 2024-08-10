import { auth, db, onAuthStateChanged, signOut } from './config.js';
import { doc, getDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');
    const profileImage = document.getElementById('profile-view');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            let uid = user.uid
            console.log(uid);
            
            logoutButton.style.display = 'block';

            const q = query(collection(db, "users"), where("uid", "==", uid));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                console.log(doc.data());
                let data = doc.data()
                profileImage.src = data.imageLink
            });

        } else {
            console.log('No user is signed in');
            logoutButton.style.display = 'none';
            if (window.location.pathname !== '/index.html') {
                window.location = 'index.html';
            }
        }
    });

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            signOut(auth).then(() => {
                swal({
                    title: "Logout Successful",
                    text: "You have been logged out successfully",
                    icon: "success",
                    button: "Ok",
                }).then(() => {
                    window.location = 'index.html';
                });
            }).catch((error) => {
                swal({
                    title: "Logout Failed",
                    text: error.message,
                    icon: "error",
                    button: "Ok",
                });
                console.error('Error during sign out:', error);
            });
        });
    } else {
        console.error('Logout button not found');
    }
});
