// Selecting UI elements
let searchbar = document.querySelector('#search-bar');
let searchbox = document.querySelector('.search-box');
let menubar = document.querySelector('#menu-bar');
let mynav = document.querySelector('.navbar');

// Toggle search box
searchbar.onclick = () => {
    searchbox.classList.toggle('active');
};

// Toggle navbar menu
menubar.onclick = () => {
    mynav.classList.toggle('active');
};

// Product data for display
const product = [
    { id: 0, image: '/images/f1.jpg', title: 'Cartoon Astronaut T-Shirts', price: 700, brand: 'Adidas' },
    { id: 1, image: '/images/f2.jpeg', title: 'Space Explorer Tees', price: 800, brand: 'Adidas' },
    { id: 2, image: '/images/f3.jpeg', title: 'Stellar Adventure T-Shirts', price: 900, brand: 'Zara' },
    { id: 3, image: '/images/f4.jpeg', title: 'Astronaut Odyssey Tees', price: 600, brand: 'Zara' },
    { id: 4, image: '/images/f5.jpeg', title: 'Interstellar Pioneer Tees', price: 1000, brand: 'Nike' },
    { id: 5, image: '/images/f6.jpeg', title: 'Cosmic Explorer Tees', price: 800, brand: 'Nike' },{ id: 6, image: '/images/f7.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 900, brand: 'Hermes' },
    { id: 7, image: '/images/f8.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 600, brand: 'Hermes' },
    { id: 8, image: '/images/n1.jpg', title: 'Cartoon Astronaut T-Shirts', price: 700, brand: 'Dior' },
    { id: 9, image: '/images/n2.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 800, brand: 'Dior' },
    { id: 10, image: '/images/n3.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 900, brand: 'Calvin Klein' },
    { id: 11, image: '/images/n4.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 600, brand: 'Adidas' },
    { id: 12, image: '/images/n5.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 1000, brand: 'Calvin Klein' },
    { id: 13, image: '/images/n6.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 800, brand: 'Zara' },
    { id: 14, image: '/images/n7.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 900, brand: 'Rolex' },
    { id: 15, image: '/images/n8.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 600, brand: 'Rolex' },
];

// Function to display products
const displayItem = (items) => {
    document.getElementById('products').innerHTML = items.map((item) => {
        const { image, brand, title, price } = item;
        return (
            `<div class="pro">
                <img src="${image}" alt="">
                <div class="des">
                    <span>${brand}</span>
                    <h5>${title}</h5>
                    <h4>₹${price}</h4>
                </div>
            </div>`
        );
    }).join('');
};

// Initial display of products
displayItem(product);

// Search bar filtering
// document.getElementById('search_input').addEventListener('keyup', (e) => {
//     const filterSearchData = e.target.value.toLowerCase();
//     const filterData = product.filter((item) => item.brand.toLowerCase().includes(filterSearchData));
//     displayItem(filterData);
// });


// 🛒 Load cart items when the page loads
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOM Loaded. Fetching cart items...");
    fetchCartItems();
});

// 🛒 Ensure cart button exists before adding event listener
const cartButton = document.querySelector("#shop-cart");
if (cartButton) {
    cartButton.addEventListener("click", () => {
        console.log("🛒 Cart button clicked!");
        fetchCartItems();
        const shoppingCart = document.getElementById("shopping-cart");
        if (shoppingCart) {
            shoppingCart.classList.toggle("active");
        } else {
            console.error("❌ Cart container not found!");
        }
    });
} else {
    console.error("❌ Cart button not found!");
}
document.querySelector(".fas.fa-times").addEventListener("click", () => {
    shoppingCart.classList.remove("active");
});
// 🛒 Fetch cart items from API
function fetchCartItems() {
    fetch("http://localhost:5000/cart")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("📦 Cart Data Received:", data);
            updateCartUI(data);
        })
        .catch(error => console.error("❌ Error fetching cart:", error));
}

// 🛒 Update the cart UI
function updateCartUI(cartItems) {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) {
        console.error("❌ Cart items container not found!");
        return;
    }

    cartContainer.innerHTML = ""; // Clear cart before adding items

    if (!cartItems || cartItems.length === 0) {
        cartContainer.innerHTML = "<p>🛒 Your cart is empty</p>";
        return;
    }

    cartItems.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px;">
            <div>
                <p>${item.name}</p>
                <span>₹${item.price}</span>
            </div>
        `;
        cartContainer.appendChild(cartItemElement);
    });

    console.log("✅ Cart UI updated successfully!");
}