const nodemailer = require("nodemailer");

const sendEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
    //   service: process.env.SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: 'bkappel16@gmail.com',
        pass: 'pxxrgnnvgfvqlrgg',
      },
    });
    // console.error('transporter', transporter )
    const verificationCode = code
    const subject = "Here's your one time code"
    await transporter.sendMail({
      from: 'Brandon Kappel',
      to: email,
      subject: subject,
      // text: text,
      text: `Your Progressional Fitness verification code is: ${verificationCode}`, // Fallback text for clients that do not support HTML
      html: `
      <div style="font-family: 'Roboto', Arial, sans-serif;">
        <h3 style="color: #444;">Your Progressional Fitness verification code</h3>
        <p style="font-size: 14px; color: #555;">
          Here's the one-time verification code you requested:
        </p>
        <div style="border-top: 1px solid #ccc; margin: 30px 0;"></div>
        <div style="text-align:center;">
          <p style="font-size: 30px; font-weight: bold; color: #555; margin: 0;">
            ${verificationCode}
          </p>
        </div>
        <div style="border-bottom: 1px solid #ccc; margin: 30px 0;"></div>
        <p style="font-size: 14px; font-weight: bold; color: #333; margin-top: 20px;">
          This code expires after 15 minutes.
        </p>
      </div>
      <style>
      @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
    </style>
    `, 
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;