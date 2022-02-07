const sgMail = require("@sendgrid/mail");

class CreateSenderSendGrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({ ...msg, from: process.env.USER_SENDGRID });
  }
}

module.exports = { CreateSenderSendGrid };
