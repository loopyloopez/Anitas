// Load environment variables from the .env file
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Stripe secret key from env variables
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Use JSON body parser

// Setup Nodemailer transport using .env for email credentials
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    auth: {
        user: process.env.EMAIL_USER, // Email address from .env
        pass: process.env.EMAIL_PASS, // Email password from .env
    }
});

// Function to send order details via email
function sendOrderDetailsToEmail(cart, customerName, customerEmail, orderTotal, res) {
    const orderDetails = cart.map(item => `${item.quantity}x ${item.name}: $${item.totalPrice}`).join('\n');
    const message = `New order from ${customerName} (${customerEmail}):\n\n${orderDetails}\n\nTotal: $${orderTotal}`;

    // Setup email options
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender address
        to: process.env.MY_EMAIL,      // Recipient email from .env
        subject: 'New Order from La Cocina Mexicana',
        text: message,
    };

    // Log before sending the email
    console.log(`Preparing to send email with the following details:
    Customer: ${customerName}
    Email: ${customerEmail}
    Order Total: $${orderTotal}
    Cart: ${JSON.stringify(cart, null, 2)}`);

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Failed to send email:', error);
            res.status(500).send('Failed to send email.');
        } else {
            console.log('Email sent successfully: ' + info.response);
            res.send('Order details sent via email successfully!');
        }
    });
}

// Endpoint for Stripe payment and sending orders
app.post('/charge', async (req, res) => {
    const token = req.body.stripeToken;
    const orderTotal = req.body.orderTotal;
    const customerName = req.body.name;
    const customerEmail = req.body.email;
    const cart = JSON.parse(req.body.cart); // Assuming cart is passed as JSON from the frontend

    // Create a charge in Stripe
    try {
        const charge = await stripe.charges.create({
            amount: Math.round(orderTotal * 100), // Convert to cents
            currency: 'usd',
            description: 'Food order from La Cocina Mexicana',
            source: token,
        });

        if (charge.status === 'succeeded') {
            // After successful payment, send email
            sendOrderDetailsToEmail(cart, customerName, customerEmail, orderTotal, res);
        } else {
            res.status(500).send('Payment failed.');
        }
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).send('Payment processing error.');
    }
});

// Endpoint for bypassing payment and directly sending orders
document.getElementById('send-orders-btn').addEventListener('click', () => {
    console.log("process startred");

    
    // Load and run the test.js script
    const script = document.createElement('script');
    script.src = 'test.js'; // Path to the test.js file
    script.type = 'text/javascript';
    script.onload = () => {
        console.log('test.js script loaded and executed.');
    };
    script.onerror = () => {
        console.error('Error loading test.js script.');
    };
    document.body.appendChild(script); // Append the script to the document body
        // Change the button color to indicate success
        const sendOrdersButton = document.getElementById('send-orders-btn');
    sendOrdersButton.style.backgroundColor = 'red';
    sendOrdersButton.style.color = 'white';
    sendOrdersButton.textContent = 'Order Sent!';
});