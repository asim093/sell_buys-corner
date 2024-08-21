import { auth, db, onAuthStateChanged, signOut, checkAuthStateAndLoadProfile } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.getElementById('profile-view');
    checkAuthStateAndLoadProfile(auth, db, profileImage);

    function renderCart() {
        const cartMain = document.getElementById('cartmain');
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        
        cartMain.innerHTML = ''; 

        cartItems.forEach((item, index) => {
            const quantity = item.quantity || 1;
            const totalPrice = (item.productPrice * quantity).toFixed(2); 

            cartMain.innerHTML += `
                <div class="card lg:card-side bg-base-100 shadow-xl mt-5">
                    <figure class="flex items-center justify-center w-64 h-64 overflow-hidden">
                        <img src="${item.productImageUrl}" alt="${item.productTitle}" class="object-contain w-full h-full" />
                    </figure>
                    <div class="card-body">
                        <h2 class="card-title">${item.productTitle}</h2>
                        <p>${item.productDescription}</p>
                        <h2>Total: <span class="item-total-price">${totalPrice}</span></h2>
                
                        <h1 class="text-2xl">Price: <span class="item-price">${item.productPrice}</span> </h1>

                        <div>
                            <p>Quantity: <span id="quantity-${index}">${quantity}</span></p>
                        </div>
                        <div class="card-actions justify-end">
                            <button class="btn btn-primary increment" data-index="${index}">+</button>
                            <button class="btn btn-primary decrement" data-index="${index}">-</button>
                            <button class="btn btn-danger remove" data-index="${index}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        });

        attachEventListeners();
        calculateTotalPrice(); 
    }

    function attachEventListeners() {
        const incrementButtons = document.querySelectorAll('.increment');
        const decrementButtons = document.querySelectorAll('.decrement');
        const removeButtons = document.querySelectorAll('.remove');

        incrementButtons.forEach(button => {
            button.addEventListener('click', incrementQuantity);
        });

        decrementButtons.forEach(button => {
            button.addEventListener('click', decrementQuantity);
        });

        removeButtons.forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }

    function incrementQuantity(event) {
        const index = event.target.dataset.index;
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cartItems[index]) {
            cartItems[index].quantity = (cartItems[index].quantity || 1) + 1;
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
        }
    }

    function decrementQuantity(event) {
        const index = event.target.dataset.index;
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (cartItems[index] && cartItems[index].quantity > 1) {
            cartItems[index].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
        } else {
            alert('At least 1 item is required');
        }
    }

    function removeFromCart(event) {
        const index = event.target.dataset.index;
        let cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        
        if (index >= 0 && index < cartItems.length) {
            cartItems.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cartItems));
            renderCart();
        }
    }

    function calculateTotalPrice() {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalPrice = cartItems.reduce((total, item) => total + (item.productPrice * (item.quantity || 1)), 0).toFixed(2);
        document.getElementById('total-price').textContent = `Total Price: ${totalPrice}`;
    }

    renderCart();
});
