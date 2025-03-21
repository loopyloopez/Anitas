// Retrieve cart from localStorage or initialize it as an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to update the cart in localStorage
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to display success message
function showSuccessMessage(message) {
    alert("Item added!");
}

// Function to add item to cart
// Function to add item to cart
function addItemToCart(itemName, itemPrice, itemQuantity, specialInstructions = '') {
    // Check if the item with the same name and instructions already exists in the cart
    const existingItem = cart.find(item => item.name === itemName && item.instructions === specialInstructions);

    if (existingItem) {
        // If item with the same name and instructions exists, update its quantity and total price
        existingItem.quantity += itemQuantity;
        existingItem.totalPrice = (existingItem.quantity * existingItem.price).toFixed(2);
    } else {
        // If the item is new, create a new object and push it to the cart
        const item = {
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity,
            totalPrice: (itemPrice * itemQuantity).toFixed(2),
            instructions: specialInstructions // Store special instructions
        };
        cart.push(item);
    }

    // Update the cart in localStorage
    updateCart();
}


// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Select all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.dataset.name;
            const itemPrice = parseFloat(button.dataset.price); // Convert price to a number

            // Ensure the itemName and itemPrice are valid
            if (!itemName || isNaN(itemPrice)) {
                showSuccessMessage("Error: Invalid item name or price.");
                return; // Stop if invalid
            }

            // Check if there's a quantity input related to the button (optional)
            let itemQuantity = 1; // Default to 1 if no quantity input exists

            // Check if there are special instructions related to the button
            const specialInstructionsId = button.dataset.instructionsId;
            let specialInstructions = ''; // Default to empty string if no instructions exist

            if (specialInstructionsId && document.getElementById(specialInstructionsId)) {
                specialInstructions = document.getElementById(specialInstructionsId).value.trim();
            }

            // Add the item to the cart with special instructions
            addItemToCart(itemName, itemPrice, itemQuantity, specialInstructions);

            // Show success message to the user
            showSuccessMessage(`${itemQuantity} ${itemName} added to your cart!`);

            // Optionally, update the cart count in the UI
            updateCartCount();
        });
    });
});

// Function to update cart count in UI (optional)
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// "Send Orders" button functionality
const sendOrdersBtn = document.getElementById('send-orders-btn');
if (sendOrdersBtn) {
    sendOrdersBtn.addEventListener('click', () => {
        // Check if the cart is empty
        if (cart.length === 0) {
            showSuccessMessage("Cart is empty. Please add items before sending orders.");
            return;
        }

        // Fetch total price from the order summary (if you have it displayed on your page)
        const orderTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);

        // Send cart details to the server to trigger Twilio SMS (or other service)
        fetch('/send-orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart: cart,
                orderTotal: orderTotal
            })
        })
        .then(response => response.text())
        .then(data => {
            showSuccessMessage("Order details sent to your phone successfully!");
        })
        .catch(error => {
            console.error('Error sending orders:', error);
            showSuccessMessage("Failed to send orders.");
        });
    });
}
