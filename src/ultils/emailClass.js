const nodemailer = require('nodemailer');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email,
        this.name = user.name,
        this.url = url,
        this.from = 'PhongVTP <hello Quynh>'
    }

    newTransport() {
       //  mail trap
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
    }

    async send(template, subject) {
        //1. render html by ejs
        // const html = pug.renderFile(`${__dirname}/views/emails/${template}.pug`);
        
        // 2. define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            // html: html,
            // text: htmlToText.fromString(html)
            text: `Quynh Tran${template}`
        }

        //3 create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the my life');
    }
}