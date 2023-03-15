
const nodemailer = require('nodemailer');
let sendForgotPasswordEmail=async(email, link)=>{
  var transport = nodemailer.createTransport({


    SSL: true,
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "wassilni@hotmail.com",
      pass: ""
    }
  });



var mailOptions = {
  from: 'wassilni@hotmail.com',
  to: email,
  subject:'Forgot My Password',
  text:`hello, you can change your password here ${link}`
  //html: '<b>Hey there! </b>'
};

transport.sendMail(mailOptions, (error, info) => {
  if (error) {
      return console.log(error);
  }
  console.log('Message sent: %s', info.messageId);
});
}
module.exports=sendForgotPasswordEmail
