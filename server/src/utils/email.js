const nodemailer = require("nodemailer");

const sendEmail = async options => {

    //1.create a transporter=> a service that will send the email, node itself won't.
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
    });


    //2.define email options
    const mailOptions = {
        from: 'jigyashusaini7@gmail.com',
        to: options.email,
        subject: options.subject,
        html: options.html
    }


    //3.actually send the email with nodemailer
    await transporter.sendMail(mailOptions, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            console.log('Email sent successfully!');
        }
    });
}

module.exports = sendEmail;