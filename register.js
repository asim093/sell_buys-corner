import { auth, db, storage, createUserWithEmailAndPassword, collection, addDoc, ref, uploadBytes, getDownloadURL, getStorage } from './config.js';

let form = document.getElementById('registerForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.querySelector('input[placeholder="First Name"]').value;
    const lastName = document.querySelector('input[placeholder="Last Name"]').value;
    const image = document.querySelector(".file-input").files[0];
    const bodyLoader = document.querySelector('.bg-gray-100');
    
    async function uploadImageAndGetUrl(email, file) {
        const storage = getStorage();
        const imageRef = ref(storage, `${email}profile.jpg`); 
        try {
            await uploadBytes(imageRef, file);
            const url = await getDownloadURL(imageRef);
            console.log('Uploaded Image URL:', url);
            return url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
    
    bodyLoader.innerHTML = `
<div class="loader-container fixed inset-0 flex items-center justify-center bg-white bg-opacity-75  z-50">
<span class="loading loading-dots w-24 h-24"></span>
</div>
`
    try {
        const imageUrl = await uploadImageAndGetUrl(email, image); 

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const docRef = await addDoc(collection(db, "users"), {
            email: email,
            firstName: firstName,
            lastName: lastName,
            uid: user.uid,
            imageLink: imageUrl  
        });

        console.log("Document written with ID: ", docRef.id);

        bodyLoader.innerHTML = `
        <div class="loader-container fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 hidden  z-50">
        <span class="loading loading-dots loading-lg"></span>
        </div>
        `
        swal({
            title: "User Registration",
            text: "User registration successful",
            icon: "success",
            button: "Ok",
        }).then(() => {
            window.location = 'login.html';
        });
    } catch (error) {
        swal({
            title: "User Registration Failed",
            text: error.message,
            icon: "error",
            button: "Ok",
        });
window.location = 'register.html'    }
});

