import { auth, db, onAuthStateChanged, signOut } from './config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout');
    const profileImage = document.getElementById('profile-view');

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log('User is signed in:', user);
            logoutButton.style.display = 'block';

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log('User document data:', userData);
                if (userData.imageLink) {
                    console.log('Profile Image URL:', userData.imageLink); 
                    profileImage.src = userData.imageLink; 
                } else {
                    console.log('No image URL found in user data.');
                }
            } else {
                console.log("No such document!");
            }
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
