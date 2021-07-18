const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });
    // define email options
    const mailOptions = {
        from: 'PhongVTP <hello Quynh>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html
    }
    // actually send email
    await transport.sendMail(mailOptions);
}

module.exports = sendEmail;