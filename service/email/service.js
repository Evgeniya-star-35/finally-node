const Mailgen = require("mailgen");

class EmailService {
  constructor(env, sender) {
    this.sender = sender;

    switch (env) {
      case "development":
        this.link = "http://localhost:4040";
        break;
      case "production":
        this.link = "https://finally-node.herokuapp.com";
        break;
      default:
        this.link = "http://localhost:4040";
        break;
    }
  }

  capitalize(str) {
    const string = str.split("@")[0];
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  createEmailTemplate(userName, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: "salted",
      product: {
        name: "HardCore LLC",
        link: this.link,
      },
    });

    const email = {
      body: {
        name: this.capitalize(userName),
        intro: "Welcome HardCore LLC! We're very excited to have you on board.",
        action: {
          instructions: "To get started with HardCore LLC, please click here:",
          button: {
            color: "#FF751D",
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    return mailGenerator.generate(email);
  }

  async sendVerifyEmail(email, userName, verifyToken) {
    const emailHtml = this.createEmailTemplate(userName, verifyToken);
    const msg = {
      to: email,
      subject: "Verify your account",
      text: "and easy to do anywhere, even with Node.js",
      html: emailHtml,
    };

    try {
      const result = await this.sender.send(msg);
      console.log(result);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}

module.exports = EmailService;
