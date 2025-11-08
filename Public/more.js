const token = localStorage.getItem("token");

// Function to fetch products from the server
function fetchProducts() {
    fetch("/products")
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("product-container");
            container.innerHTML = ""; // Clear the container

            data.forEach(product => {
                container.innerHTML += `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.name}">
                        <h3>${product.name}</h3>
                        <p>₹${product.price}</p>
                        <p>Category: ${product.category}</p>
                        <p>Stock: ${product.stock}</p>
                        <button onclick="addToCart('${product._id}')">Add to Cart</button>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
}

fetchProducts();

function addToCart(productId, productName, productPrice, productImage) {
    const token = localStorage.getItem("token");
    const userId = 'userId-from-token'; // Replace with actual userId, possibly from JWT

    const cartData = {
        userId,
        productId,
        name: productName,
        price: productPrice,
        image: productImage
    };

    // Send the data to the backend
    fetch('/add-products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // If you're using token-based authentication
        },
        body: JSON.stringify(cartData)
    })
    .then(res => res.json())
    .then(data => {
        alert(`item been added to your cart!`);
    })
    .catch(error => {
        console.error('Error adding to cart:', error);
    });
}

