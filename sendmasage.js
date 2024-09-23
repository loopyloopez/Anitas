const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('your-secret-key-here'); // Replace with your Stripe secret key
const twilio = require('twilio');

// Twilio credentials from your Twilio dashboard
const accountSid = 'US2c50258a78b83790065608f0e241904e'; // Replace with your Twilio Account SID
const authToken = '1bef0962437dcce884a42af46927d176';   // Replace with your Twilio Auth Token
const client = new twilio(accountSid, authToken);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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
            description: 'Food order from Anitas',
            source: token,
        });

        if (charge.status === 'succeeded') {
            // Compose the message with the order details
            const orderDetails = cart.map(item => `${item.name}: $${item.price}`).join('\n');
            const message = `New order from ${customerName} (${customerEmail}):\n${orderDetails}\nTotal: $${orderTotal}`;

            // Send SMS with Twilio
            client.messages.create({
                body: message,
                from: 'your-twilio-phone-number', // Your Twilio phone number
                to: 'recipient-phone-number'     // The phone number where you want to send the SMS
            })
            .then(() => {
                res.send('Payment and SMS sent successfully!');
            })
            .catch(error => {
                console.error('Failed to send SMS:', error);
                res.status(500).send('Payment succeeded but failed to send SMS.');
            });
        } else {
            res.status(500).send('Payment failed.');
        }
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).send('Payment processing error.');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
