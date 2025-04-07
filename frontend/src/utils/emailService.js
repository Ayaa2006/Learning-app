// src/utils/emailService.js
const nodemailer = require('nodemailer');
const config = require('../config');

// Configuration du transporteur d'emails (à adapter selon votre configuration)
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password
  }
});

/**
 * Envoie un email de bienvenue à un nouvel utilisateur
 * @param {string} email - L'adresse email du destinataire
 * @param {string} name - Le nom de l'utilisateur
 * @param {string} password - Le mot de passe temporaire
 * @returns {Promise} - Une promesse qui se résout lorsque l'email est envoyé
 */
const sendWelcomeEmail = async (email, name, password) => {
  const mailOptions = {
    from: `"SkillPath" <${config.email.user}>`,
    to: email,
    subject: 'Bienvenue sur SkillPath!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4CAF50; text-align: center;">Bienvenue sur SkillPath!</h2>
        <p>Bonjour ${name},</p>
        <p>Nous sommes ravis de vous accueillir sur la plateforme SkillPath. Votre compte a été créé avec succès.</p>
        <p>Voici vos informations de connexion:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mot de passe temporaire:</strong> ${password}</p>
        </div>
        <p>Lors de votre première connexion, vous serez invité(e) à changer votre mot de passe.</p>
        <p>Vous pouvez vous connecter en cliquant sur le bouton ci-dessous:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${config.frontendUrl}/login" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Se connecter</a>
        </div>
        <p>Si vous avez des questions, n'hésitez pas à contacter notre équipe de support.</p>
        <p>Cordialement,</p>
        <p>L'équipe SkillPath</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Envoie un email de réinitialisation de mot de passe
 * @param {string} email - L'adresse email du destinataire
 * @param {string} name - Le nom de l'utilisateur
 * @param {string} newPassword - Le nouveau mot de passe temporaire
 * @returns {Promise} - Une promesse qui se résout lorsque l'email est envoyé
 */
const sendPasswordResetEmail = async (email, name, newPassword) => {
  const mailOptions = {
    from: `"SkillPath" <${config.email.user}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe SkillPath',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #2196F3; text-align: center;">Réinitialisation de mot de passe</h2>
        <p>Bonjour ${name},</p>
        <p>Votre mot de passe SkillPath a été réinitialisé comme demandé.</p>
        <p>Voici votre nouveau mot de passe temporaire:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center;">
          <p style="font-size: 18px; font-weight: bold;">${newPassword}</p>
        </div>
        <p>Lors de votre prochaine connexion, vous serez invité(e) à changer ce mot de passe temporaire.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez contacter immédiatement notre support.</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${config.frontendUrl}/login" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Se connecter</a>
        </div>
        <p>Cordialement,</p>
        <p>L'équipe SkillPath</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Envoie un email personnalisé
 * @param {string} email - L'adresse email du destinataire
 * @param {string} name - Le nom de l'utilisateur
 * @param {string} subject - L'objet de l'email
 * @param {string} message - Le contenu du message
 * @returns {Promise} - Une promesse qui se résout lorsque l'email est envoyé
 */
const sendEmail = async (email, name, subject, message) => {
  const mailOptions = {
    from: `"SkillPath" <${config.email.user}>`,
    to: email,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #673AB7; text-align: center;">${subject}</h2>
        <p>Bonjour ${name},</p>
        <div style="margin: 20px 0;">
          ${message}
        </div>
        <p>Cordialement,</p>
        <p>L'équipe SkillPath</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmail
};