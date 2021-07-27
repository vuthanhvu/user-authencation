const sgMail = require('@sendgrid/mail');

module.exports = class SendGridEmail {

    async sendMail(options) {
        sgMail.setApiKey(process.env.SENDGRID_APIKEY);
        await sgMail.send(options);
    }
}