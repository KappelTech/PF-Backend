const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
    //   service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: 'bkappel16@gmail.com',
        pass: 'Orangelemons1!',
      },
    });
    // console.error('transporter', transporter )

    await transporter.sendMail({
      from: 'Brandon Kappel',
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;