const sgMail=require('@sendgrid/mail')







const nodemailer = require("nodemailer");

const sendEmailVerificationEmail = async (email, subject, url) => {
  try {
    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "9d69c7045cda32",
          pass: ""
        }
      });

    
    await transport.sendMail({
      to: email,
      subject: subject,
      text: url,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};




module.exports=sendEmailVerificationEmail