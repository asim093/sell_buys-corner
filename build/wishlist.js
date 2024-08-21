document.addEventListener('DOMContentLoaded', () => {
    const wishlistItemsContainer = document.getElementById('wishlist-items');
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    function updatedWish() {
        if (wishlist.length === 0) {
            alert('NO ITEMS IN WISHLIST');
        } else {
            wishlist.forEach((item, index) => {
                const itemContainer = document.createElement('div');
                itemContainer.className = "wishlist-item flex flex-wrap justify-center border w-[100%] h-[auto] rounded p-4 bg-white mx-auto";

                const imageContainer = document.createElement('div');
                imageContainer.className = "w-1/2 flex-shrink-0";
                const img = document.createElement('img');
                img.src = item.productImageUrl;
                img.alt = item.productTitle;
                img.className = "w-full h-[10rem] rounded";
                imageContainer.appendChild(img);

                const nameContainer = document.createElement('div');
                nameContainer.className = "flex-grow flex items-center justify-center";
                const name = document.createElement('h3');
                name.className = "text-lg font-semibold";
                name.textContent = item.productTitle;
                nameContainer.appendChild(name);

                const deleteContainer = document.createElement('div');
                deleteContainer.className = "flex items-center justify-end";
                const deleteButton = document.createElement('button');
                deleteButton.className = "bg-red-500 text-white px-4 py-2 rounded";
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener('click', () => {
                    wishlist.splice(index, 1);
                    localStorage.setItem('wishlist', JSON.stringify(wishlist));
                    itemContainer.remove();
                });

                deleteContainer.appendChild(deleteButton);

                itemContainer.appendChild(imageContainer);
                itemContainer.appendChild(nameContainer);
                itemContainer.appendChild(deleteContainer);

                wishlistItemsContainer.appendChild(itemContainer);
            });
        }
    }

    updatedWish(); 
});
