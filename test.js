const nodemailer = require('nodemailer');

// Create a transporter object using Gmail and hardcoded credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rrayoo.e@gmail.com', // Your Gmail email address
        pass: 'zzneaiubanbbrwis',    // Your app password (16 characters)
    }
});

// Setup email data
const mailOptions = {
    from: 'rrayoo.e@gmail.com',  // Sender address
    to: 'rrayoo.e@gmail.com',    // Receiver's email address
    subject: 'Test Email',       // Subject line
    text: 'This is a test email sent from a Node.js script using nodemailer!',  // Plain text body
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log('Error occurred: ', error);
    }
    console.log('Email sent: ' + info.response);
});
