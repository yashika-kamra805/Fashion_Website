// Selecting UI elements
let searchbar = document.querySelector('#search-bar');
let searchbox = document.querySelector('.search-box');
let menubar = document.querySelector('#menu-bar');
let mynav = document.querySelector('.navbar');
let shoppingCart = document.getElementById("shopping-cart");

// Toggle search box
searchbar.onclick = () => {
    searchbox.classList.toggle('active');
};

// Toggle navbar menu
menubar.onclick = () => {
    mynav.classList.toggle('active');
};

// Product data
const product = [
    { id: 0, image: '/images/f1.jpg', title: 'Cartoon Astronaut T-Shirts', price: 700, brand: 'Adidas' },
    { id: 1, image: '/images/f2.jpeg', title: 'Space Explorer Tees', price: 800, brand: 'Adidas' },
    { id: 2, image: '/images/f3.jpeg', title: 'Stellar Adventure T-Shirts', price: 900, brand: 'Zara' },
    { id: 3, image: '/images/f4.jpeg', title: 'Astronaut Odyssey Tees', price: 600, brand: 'Zara' },
    { id: 4, image: '/images/f5.jpeg', title: 'Interstellar Pioneer Tees', price: 1000, brand: 'Nike' },
    { id: 5, image: '/images/f6.jpeg', title: 'Cosmic Explorer Tees', price: 800, brand: 'Nike' },
    { id: 6, image: '/images/f7.jpeg', title: 'Cartoon Astronaut T-Shirts', price: 900, brand: 'Hermes' },
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

// Display product cards
const displayItem = (items) => {
    document.getElementById('products').innerHTML = items.map((item) => {
        const { id, image, brand, title, price } = item;
        return `
        <div class="pro">
            <img src="${image}" alt="${title}">
            <div class="des">
                <span>${brand}</span>
                <h5>${title}</h5>
                <h4>₹${price}</h4>
            </div>
            <a href="#" onclick='addToCart(${id})'>
                <i class="fas fa-shopping-cart"></i>
            </a>
        </div>`;
    }).join('');
};
displayItem(product);

// Fetch cart on load
document.addEventListener("DOMContentLoaded", () => {
    fetchCartItems();
});

// Cart toggle logic
const cartButton = document.querySelector("#shop-cart");
if (cartButton && shoppingCart) {
    cartButton.addEventListener("click", () => {
        fetchCartItems();
        shoppingCart.classList.toggle("active");
    });
}

// Close cart
const closeCartBtn = document.querySelector(".fa-times");
if (closeCartBtn && shoppingCart) {
    closeCartBtn.addEventListener("click", () => {
        shoppingCart.classList.remove("active");
    });
}

// Fetch cart items from backend
function fetchCartItems() {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found.");

    fetch("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        updateCartUI(data);
    })
    .catch(err => console.error("Fetch cart error:", err));
}

// Update UI with cart items
function updateCartUI(cartItems) {
    const cartContainer = document.getElementById("cart-items");
    if (!cartContainer) return console.error("Cart container missing!");

    cartContainer.innerHTML = "";

    if (!cartItems || cartItems.length === 0) {
        cartContainer.innerHTML = "<p>🛒 Your cart is empty</p>";
        return;
    }

    let total = 0;

    cartItems.forEach(item => {
        total += item.price;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width:50px; height:50px;">
            <div>
                <p>${item.title}</p>
                <span>₹${item.price}</span>
                <button onclick="removeFromCart('${item.itemId}')">Remove</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    // Add total price section
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("cart-total");
    totalDiv.innerHTML = `<h5>Total: ₹${total}</h5>`;
    cartContainer.appendChild(totalDiv);
}

// Add product to cart
function addToCart(productId) {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Not authenticated.");

    const productToAdd = product.find(p => p.id === productId);
    if (!productToAdd) return console.error("Product not found.");

    fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productToAdd) // Send full product details
    })
    .then(res => res.json())
    .then(data => {
        console.log("Added to cart:", data);
        fetchCartItems();
    })
    .catch(err => console.error("Add to cart error:", err));
}

// Remove item from cart
function removeFromCart(itemId) {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found.");

    fetch("http://localhost:5000/cart/remove", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ itemId })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Removed from cart:", data);
        fetchCartItems();
    })
    .catch(err => console.error("Remove error:", err));
}


// Display avatar from token
const token = localStorage.getItem("token");
if (token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email || "User";
        const firstLetter = email.charAt(0).toUpperCase();
        const avatar = document.getElementById("user-avatar");
        if (avatar) {
            avatar.style.display = "flex";
            avatar.textContent = firstLetter;
        }
    } catch (e) {
        console.error("Invalid token");
    }
}
