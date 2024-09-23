const nodemailer = require('nodemailer');

// Nodemailer transporter setup (use your Gmail credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rrayoo.e@gmail.com',  // Replace with your Gmail email
        pass: 'your-gmail-app-password'  // Replace with your Gmail App Password
    }
});

// Define the function to send an email
function sendMail() {
    const mailOptions = {
        from: 'rrayoo.e@gmail.com',  // Sender email address
        to: 'rrayoo.e@gmail.com',    // Receiver's email address
        subject: 'Test Email',       // Subject line
        text: 'Testing email from email.js'  // The message content
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error('Error sending email:', error);
        }
        console.log('Email sent: ' + info.response);
    });
}

// Export the sendMail function so it can be called from server.js
module.exports = { sendMail };
