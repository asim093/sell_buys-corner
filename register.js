import { auth, db, storage, createUserWithEmailAndPassword, collection, addDoc, ref, uploadBytes, getDownloadURL, getStorage } from './config.js';

let form = document.getElementById('registerForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.querySelector('input[placeholder="First Name"]').value;
    const lastName = document.querySelector('input[placeholder="Last Name"]').value;
    const image = document.querySelector(".file-input").files[0];

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

        swal({
            title: "User Registration",
            text: "User registration successful",
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
        });
        console.error(error);
    }
});

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
