const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SkillPath" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email envoyé:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur d\'envoi d\'email:', error);
    return false;
  }
};

module.exports = { sendEmail };