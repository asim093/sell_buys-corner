import { auth, db, onAuthStateChanged } from './config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const profile_name = document.getElementById('seller_name');
const profile_email = document.getElementById('seller_email');
const profile_number = document.getElementById('seller_number');
const profile_image = document.getElementById('seller_image');
const recent_ads_container = document.getElementById('seller_main');
const loader = document.querySelector('.loader');

async function getUserDataAndAds() {
    loader.innerHTML = `  
        <div class="loader-container fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <span class="loading loading-dots w-24 h-24"></span>
        </div>
    `;

    let loader_container = document.querySelector('.loader-container');
    
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
    
    if (!selectedProduct || !selectedProduct.uid) {
        console.error("No selected product or invalid product data.");
        loader_container.style.display = 'none';
        return;
    }

    try {
        const userQuery = query(collection(db, "users"), where("uid", "==", selectedProduct.uid));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
            console.error("No user data found for the selected product's seller.");
            loader_container.style.display = 'none';
            return;
        }

        userSnapshot.forEach((doc) => {
            let data = doc.data();
            profile_name.innerText = data.firstName || "Name not available";
            profile_email.innerText = data.email || "Email not available";
            profile_image.src = data.imageLink || "https://via.placeholder.com/150";
        });

        const adsQuery = query(collection(db, "Products"), where("uid", "==", selectedProduct.uid));
        const adsSnapshot = await getDocs(adsQuery);

        if (adsSnapshot.empty) {
            console.error("No ads found for the user.");
            profile_number.innerText = 'Number of ads: 0';
        } else {
            const adsCount = adsSnapshot.size;
            profile_number.innerText = `Number of ads: ${adsCount}`;
            
            recent_ads_container.innerHTML = '';
            adsSnapshot.forEach((doc) => {
                let ad = doc.data();
                const adElement = document.createElement('div');
                adElement.className = "bg-white shadow-md rounded-lg p-4";

                adElement.innerHTML = `
                    <img src="${ad.productImageUrl || 'https://via.placeholder.com/300x200'}" alt="${ad.productTitle || 'Product Image'}" class="w-full h-40 object-cover mb-4 rounded-md">
                    <h4 class="text-lg font-semibold mb-2">${ad.title || 'Product Title'}</h4>
                    <p class="text-gray-600">${ad.productTitle || 'Brief description of the product.'}</p>
                `;

                recent_ads_container.appendChild(adElement);
            });
        }

        loader_container.style.display = 'none';

    } catch (error) {
        console.error("Error fetching user data or ads:", error);
        loader_container.style.display = 'none'; 
    }
}

getUserDataAndAds();
