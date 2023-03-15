const sgMail=require('@sendgrid/mail')
const sendGridApiKey=

sgMail.setApiKey(sendGridApiKey)

const sendChangePasswordEmail=async (email,link)=>{
    await sgMail.send({
    to: email,
    from:'danah20002010@gmail.com',
    subject:'Forgot My Password',
    text:`hello, you can change your password here ${link}`
})



}




module.exports=sendChangePasswordEmail