import { auth, db, onAuthStateChanged, signOut, checkAuthStateAndLoadProfile } from './config.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const userAvatar = document.querySelector('.dropdown-end');
const logoutButton = document.getElementById('logout');
const profileImage = document.getElementById('profile-view');
const carddiv = document.querySelector('.card-div');
const searchInput = document.getElementById('Search');
const searchButton = document.getElementById('search-button');
const cardMain = document.querySelector('.card-main');
const wishlistitems = document.getElementById('wishlist-items');

let selectedProduct = null; 
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

checkAuthStateAndLoadProfile(auth, db, profileImage);

async function getAllProducts(searchValue = '') {
    carddiv.innerHTML = '<span class="loading loading-dots w-24 h-24 mx-auto pt-10"></span>'; 

    try {
        const productsQuery = query(collection(db, "Products"));
        const querySnapshot = await getDocs(productsQuery);

        carddiv.innerHTML = '';

        let cardArray = [];
        searchValue = searchValue.toLowerCase();

        querySnapshot.forEach((doc) => {
            const productData = doc.data();
            productData.id = doc.id;  
            cardArray.push(productData);
        });

        const filteredProducts = cardArray.filter(product =>
            product.productTitle.toLowerCase().includes(searchValue)
        );

        filteredProducts.forEach((product) => {
            carddiv.innerHTML += `
            <div class="card bg-base-100 shadow-xl w-full md:w-[48%] lg:w-[48%] mb-4">
                <figure>
                    <img src="${product.productImageUrl}" class="h-[25rem]" alt="Product Image" />
                </figure>
                <div class="card-body">
                    <h2 class="card-title">${product.productTitle}</h2>
                    <p>${product.productDescription}</p>
                    <div class="card-actions justify-between">
                        <div class="text-lg font-bold pt-5">Rs: ${product.productPrice}</div>
                        <button class="btn btn-primary more-info-btn" data-product-id="${product.id}">MORE INFO</button>
                    </div>
                </div>
            </div>`;
        });

        const moreInfoButtons = document.querySelectorAll('.more-info-btn');
        moreInfoButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const productId = event.target.getAttribute('data-product-id');
                selectedProduct = filteredProducts.find(product => product.id === productId);
                if (selectedProduct) {
                    localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
                    window.location = 'singleproduct.html';
                }
            });
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        getAllProducts(); 

        searchButton.addEventListener('click', () => {
            const searchValue = searchInput.value.trim();
            getAllProducts(searchValue);
        });

        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                const searchValue = searchInput.value.trim();
                getAllProducts(searchValue);
            }
        });
    } else {
        console.log('User is not logged in');
        window.location = 'login.html';
    }
});

logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        swal({
            title: "Logout Successful",
            text: "You have been logged out successfully",
            icon: "success",
            button: "Ok",
        }).then(() => {
            window.location = 'login.html';
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

document.addEventListener('DOMContentLoaded', () => {
    selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));

    if (selectedProduct) {
        cardMain.innerHTML = `
        <h1 class="text-4xl font-bold mb-6 text-start">${selectedProduct.productTitle}</h1>
        <div class="card card-side bg-base-100 shadow-xl p-4 flex flex-col lg:flex-row">
            <div class="w-full lg:w-[35rem] lg:h-[30rem] mb-4 lg:mb-0">
                <img src="${selectedProduct.productImageUrl}" class="w-[90%]" alt="Product Image" class="w-full h-full object-cover rounded-lg">
            </div>

            <div class="w-full lg:w-1/2 flex flex-col justify-between p-4">
                <div class="price-section flex justify-between items-center mb-4">
                    <div>
                        <h2 class="text-2xl lg:text-4xl font-bold text-dark">${selectedProduct.productPrice}</h2>
                        <p class="text-lg lg:text-xl font-semibold mt-2">${selectedProduct.productTitle}</p>
                        <p class="text-sm text-gray-600 mt-1">${selectedProduct.productDescription}</p>
                    </div>

                    <div id="heart-container" class="h-6 w-6 lg:h-8 lg:w-8">
                        <button id="heart">
                            <svg id="heart-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-red-600">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.172 5.172a4 4 0 015.656 0L12 8.344l3.172-3.172a4 4 0 015.656 5.656L12 21.172l-8.828-8.828a4 4 0 010-5.656z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="bg-blue-500 text-white p-4 rounded-lg mb-4">
                    <div class="flex items-center space-x-4">
                        <div class="avatar">
                            <div class="w-16 h-16 rounded-full overflow-hidden">
                                <img src="https://via.placeholder.com/100" id="sellerImage" />
                            </div>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg" id="sellerName">M Ali</h3>
                            <p class="text-sm">Member since June 2024</p>
                        </div>
                    </div>
                    <div class="flex flex-col lg:flex-row justify-between items-center mt-4">
                        <button class="btn btn-grey w-full lg:w-40 mb-2 lg:mb-0" id='SellerPopup'>Call Now</button>
                        <a href="sellerprofile.html" class="text-white underline">See profile</a>
                    </div>
                </div>

                <div class="flex flex-col lg:flex-row w-full justify-between">
                    <div class="w-full lg:w-1/2 mb-2 lg:mb-0">
                        <button class="btn btn-primary w-full px-10" id='SellerPopup'>ADD TO CART</button>
                    </div>

                    <div class="flex items-center space-x-2 mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-gray-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2C8.7 2 6 4.7 6 8c0 3.3 4.4 7.8 5.6 9.2 1.2-1.4 5.6-5.9 5.6-9.2 0-3.3-2.7-6-6-6zm0 8c-1.1 0-2-1.1-2-2s.9-2 2-2 2 1.1 2 2-.9 2-2 2z" />
                        </svg>
                        <span class="text-sm text-gray-600">Location: Lahore, Pakistan</span>
                    </div>
                </div>
            </div>
        </div> <div class="card bg-base-100 shadow-xl mt-8 p-4">
                <h3 class="text-lg font-semibold mb-2">Details</h3>
                <div class="flex flex-wrap  gap-4">
                    <div><p><strong>Is Deliverable:</strong> NO</p></div>
                    <div><p id="product_name"><strong>Brand: ${selectedProduct.productTitle}</strong></p></div>
                    <div><p id="products_price"><strong>Price:</strong> ${selectedProduct.productPrice}</p></div>
                    <div><p><strong>Condition:</strong> Used</p></div>
                </div>

                <div class="card bg-base-100 shadow-xl mt-4 p-4">
                    <h3 class="text-lg font-semibold mb-2">Description</h3>
                    <p id="product_description">${selectedProduct.productDescription}</p>
                </div>
            </div>`;



      
        const sellerPopup = document.getElementById('SellerPopup');
        sellerPopup.addEventListener('click' , () => {
            try{
                console.log('number')
                swal({
                    title: "Call Karle Khud",
                    text: selectedProduct.sellerNumber,
                    // icon: "info",
                    button: "Ok",
                })
            }catch{
                alert('NO NUMBER FOUND')
            }
            
        });

        const sellerImage = document.getElementById('sellerImage');
        const seller_Name = document.getElementById('sellerName');
        async function getsellerImage() {
            onAuthStateChanged(auth, async (user) => {
                if (selectedProduct) {
                    try {
                        const uid = user.uid;
                        const q = query(collection(db, "users"), where("uid", "==", selectedProduct.uid));
                        const querySnapshot = await getDocs(q);
                       

                        querySnapshot.forEach((doc) => {
                            let data = doc.data();
                            console.log(data)
                            sellerImage.src = data.imageLink;
                            seller_Name.innerText = data.firstName
                        });

                    } catch (error) {
                        console.error("Error fetching user data:", error);
                    }
                }
            })
        }


        getsellerImage();

        const heartButton = document.querySelector('#heart');
        const heartIcon = document.querySelector('#heart-icon');
        let isHeartFilled = JSON.parse(localStorage.getItem('wishlist'))?.some(item => item.id === selectedProduct.id) || false;
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

        heartIcon.style.fill = isHeartFilled ? 'red' : 'none';

        function updateWishlistDisplay() {
            if (wishlistitems) {
                wishlistitems.innerHTML = '';

                if (wishlist.length === 0) {
                    wishlistitems.innerHTML = '<p class="text-center text-gray-500">No items in your wishlist.</p>';
                    return;
                } else {
                    wishlistitems.innerHTML = wishlist.map(item => `
                        <div class="wishlist-item">
                            <h3>${item.productTitle}</h3>
                            <p>${item.productPrice}</p>
                        </div>`
                    ).join('');

                }
                return;
            }
        }

        heartButton.addEventListener('click', () => {
            isHeartFilled = !isHeartFilled;
            heartIcon.style.fill = isHeartFilled ? 'red' : 'none';

            if (isHeartFilled) {
                if (!wishlist.some(item => item.id === selectedProduct.id)) {
                    wishlist.push(selectedProduct);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                }
            } else {
                wishlist = wishlist.filter(item => item.id !== selectedProduct.id);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
            }

            updateWishlistDisplay();
        });

        updateWishlistDisplay();
    }
});