import { auth, db, storage, collection, addDoc, ref, uploadBytes, getDownloadURL } from './config.js';
import { checkAuthStateAndLoadProfile } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const uploadDiv = document.getElementById('uploadDiv');
    const product_title = document.getElementById('product-title');
    const product_price = document.getElementById('product-price');
    const product_description = document.getElementById('product-description');
    const seller_name = document.getElementById('seller-name');
    const seller_number = document.getElementById('seller-number');
    const productForm = document.getElementById('productForm');
    const profileImage = document.getElementById('profile-view');
    const bodyLoader = document.querySelector('.bg-gray-100');

    if (uploadDiv) {
        uploadDiv.addEventListener('click', () => {
            document.getElementById('fileInput').click();
        });
    }

    async function uploadProductImageAndGetUrl(product_title, product_image) {
        const imagePath = `${product_title.value}.jpg`; // Fixed image path
        const imageRef = ref(storage, imagePath);
        try {
            await uploadBytes(imageRef, product_image);
            const url = await getDownloadURL(imageRef);
            console.log('Uploaded Image URL:', url);
            return url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    checkAuthStateAndLoadProfile();

    if (productForm) {
        productForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission behavior
            alert('button clicked'); // For debugging purposes

            const product_image = document.getElementById('fileInput').files[0];
            if (!product_image) {
                swal({
                    title: "No Image Selected",
                    text: "Please select an image to upload.",
                    icon: "error",
                    button: "Ok",
                });
                return;
            }

            if (bodyLoader) {
                bodyLoader.innerHTML = `
                    <div class="loader-container fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                        <span class="loading loading-dots w-24 h-24"></span>
                    </div>
                `;
            }

            try {
                const imageUrl = await uploadProductImageAndGetUrl(product_title, product_image);

               const productdata =  await addDoc(collection(db, "Products"), {
                    productTitle: product_title.value,
                    productPrice: product_price.value,
                    sellerName: seller_name.value,
                    sellerNumber: seller_number.value,
                    productDescription: product_description.value,
                    productImageUrl: imageUrl,
                    uid: auth.currentUser.uid,
                });

                if (bodyLoader) {
                    bodyLoader.innerHTML = ''; // Hide the loader
                }

                swal({
                    title: "Product",
                    text: "Product added successfully",
                    icon: "success",
                    button: "Ok",
                }).then(() => {
                    window.location = 'index.html';
                });
            } catch (error) {
                if (bodyLoader) {
                    bodyLoader.innerHTML = ''; 
                }
                swal({
                    title: "Product Upload Failed",
                    text: error.message,
                    icon: "error",
                    button: "Ok",
                });
                console.error('Product upload failed:', error);
            }
        });
    }
});
