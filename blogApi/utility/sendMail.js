const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Novdev" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    console.error("Nodemailer error details:", error);
    throw error;
  }
};

module.exports = sendMail;