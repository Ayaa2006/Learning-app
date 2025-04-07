const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Route pour le dashboard admin
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Dashboard admin accessible'
  });
});

// Route pour récupérer tous les utilisateurs

router.get('/users', async (req, res) => {
  console.log("Route GET /users appelée");
  try {
    const users = await User.find();
    console.log("Utilisateurs trouvés:", users.length);
    res.json(users);
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
  }
});
// Route pour ajouter un utilisateur
router.post('/users', async (req, res) => {
  try {
    const { name, email, role, birthDate, speciality, status, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' });
    }
    
    // Créer un nouvel utilisateur
    const userData = { name, email, role, status };
    
    // Ajout de champs spécifiques
    if (birthDate) userData.birthDate = birthDate;
    if (speciality) userData.speciality = speciality;
    
    // Hash du mot de passe pour les profs et admins
    if (role === 'TEACHER' || role === 'ADMIN') {
      userData.password = await bcrypt.hash(password, 10);
    }
    
    const user = await User.create(userData);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
  }
});

// Route pour modifier un utilisateur
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, birthDate, speciality, status } = req.body;
    
    // Créer l'objet de mise à jour
    const updateData = { name, email, status };
    if (birthDate) updateData.birthDate = birthDate;
    if (speciality) updateData.speciality = speciality;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error: error.message });
  }
});

// Route pour supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: error.message });
  }
});

// Route pour changer le statut d'un utilisateur
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du changement de statut', error: error.message });
  }
});



// Route pour réinitialiser le mot de passe
router.patch('/users/:id/password', async (req, res) => {
  console.log('TENTATIVE DE RÉINITIALISATION - ID:', req.params.id);
  try {
    // Récupérer l'utilisateur
    const user = await User.findById(req.params.id);
    console.log('UTILISATEUR TROUVÉ:', user ? 'OUI' : 'NON');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    console.log('RÔLE:', user.role);
    // Autoriser uniquement TEACHER et ADMIN
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      console.log('RÉINITIALISATION REFUSÉE - RÔLE NON AUTORISÉ');
      return res.status(403).json({ 
        message: 'Seuls les mots de passe des professeurs et administrateurs peuvent être réinitialisés' 
      });
    }
    
    console.log('RÉINITIALISATION AUTORISÉE - GÉNÉRATION DU NOUVEAU MOT DE PASSE');
    // Générer un mot de passe aléatoire
    const newPassword = Math.random().toString(36).slice(-8).toUpperCase();
    
    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    await user.save();
    
    console.log('MOT DE PASSE RÉINITIALISÉ AVEC SUCCÈS');
    
    // Envoyer l'email
    const { sendEmail } = require('../utils/emailService');
    try {
      await sendEmail(
        user.email,
        'Réinitialisation de votre mot de passe SkillPath',
        `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Bonjour ${user.name},</p>
        <p>Votre mot de passe a été réinitialisé avec succès.</p>
        <p>Votre nouveau mot de passe est: <strong>${newPassword}</strong></p>
        <p>Nous vous recommandons de changer ce mot de passe dès votre prochaine connexion.</p>
        <p>Cordialement,<br>L'équipe SkillPath</p>
        `
      );
      console.log('EMAIL ENVOYÉ AVEC SUCCÈS');
    } catch (emailError) {
      console.error("ERREUR D'ENVOI D'EMAIL:", emailError);
    }
    
    res.json({ 
      message: 'Mot de passe réinitialisé avec succès', 
      newPassword: newPassword
    });
  } catch (error) {
    console.error('ERREUR COMPLÈTE:', error);
    res.status(500).json({ 
      message: 'Erreur lors de la réinitialisation du mot de passe', 
      error: error.message 
    });
  }
});
// Route de diagnostic temporaire
router.get('/debug-user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Affiche toutes les informations pertinentes
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleType: typeof user.role,
      roleUppercase: user.role.toUpperCase(),
      isTeacher: user.role === 'TEACHER',
      isAdmin: user.role === 'ADMIN',
      allFields: user.toObject()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route TEST simple pour réinitialiser mot de passe (TEMPORAIRE)
router.get('/reset-password-test/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.json({ status: 'error', message: 'Utilisateur non trouvé' });
    }
    
    res.json({ 
      status: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        canReset: (user.role === 'TEACHER' || user.role === 'ADMIN')
      }
    });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});
// ROUTE TEMPORAIRE avec envoi d'email
router.get('/force-reset/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.json({ status: 'error', message: 'Utilisateur non trouvé' });
    }
    
    // Générer un mot de passe simple
    const newPassword = Math.random().toString(36).slice(-8).toUpperCase();
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Mettre à jour
    user.password = hashedPassword;
    await user.save();

    // Envoyer l'email
    let emailSent = false;
    try {
      const { sendEmail } = require('../utils/emailService');
      await sendEmail(
        user.email,
        'Réinitialisation de votre mot de passe SkillPath',
        `
        <h1>Réinitialisation de mot de passe</h1>
        <p>Bonjour ${user.name},</p>
        <p>Votre mot de passe a été réinitialisé avec succès.</p>
        <p>Votre nouveau mot de passe est: <strong>${newPassword}</strong></p>
        <p>Nous vous recommandons de changer ce mot de passe dès votre prochaine connexion.</p>
        <p>Cordialement,<br>L'équipe SkillPath</p>
        `
      );
      emailSent = true;
      console.log("Email envoyé à", user.email);
    } catch (emailError) {
      console.error("Erreur d'envoi d'email:", emailError);
    }
    
    res.json({ 
      status: 'success',
      message: 'Mot de passe réinitialisé',
      newPassword: newPassword,
      emailSent: emailSent,
      emailAddress: user.email
    });
  } catch (error) {
    res.json({ status: 'error', message: error.message });
  }
});
// Route pour réinitialiser le mot de passe et renvoyer les informations pour le mailto
router.get('/reset-for-mailto/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'utilisateur est un professeur ou un administrateur
    if (user.role !== 'TEACHER' && user.role !== 'ADMIN') {
      return res.status(403).json({ 
        message: 'Seuls les mots de passe des professeurs et administrateurs peuvent être réinitialisés' 
      });
    }
    
    // Générer un mot de passe aléatoire
    const newPassword = Math.random().toString(36).slice(-8).toUpperCase();
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Mettre à jour
    user.password = hashedPassword;
    await user.save();
    
    // Renvoyer les informations pour le mailto
    res.json({
      status: 'success',
      email: user.email,
      name: user.name,
      newPassword: newPassword,
      subject: 'Réinitialisation de votre mot de passe SkillPath'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
});
// Route d'urgence - ne vérifie rien, reset direct
router.get('/emergency-reset/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const newPassword = Math.random().toString(36).slice(-8).toUpperCase();
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    
    // Création du corps du message avec le format demandé
    const emailBody = `Bonjour ${user.name},

Votre mot de passe de la plateforme SkillPath est: ${newPassword}

Cordialement,
L'équipe SkillPath`;
    
    // URL avec mailto direct et le nouveau message
    const mailtoUrl = `mailto:${user.email}?subject=Mot%20de%20passe%20SkillPath&body=${encodeURIComponent(emailBody)}`;
    
    // Renvoie l'URL mailto et le mot de passe
    res.json({ 
      mailtoUrl,
      password: newPassword,
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Route pour enregistrer un admin
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'admin existe déjà
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Un administrateur avec cet email existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel admin
    const newAdmin = new User({
      email,
      password: hashedPassword,
      role: 'ADMIN' // Assure-toi que ce champ existe dans ton modèle
    });

    await newAdmin.save();

    // Créer un token JWT
    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email, role: 'ADMIN' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Admin enregistré avec succès',
      token
    });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de l\'admin:', err);
    res.status(500).json({ 
      message: 'Erreur lors de l\'enregistrement de l\'admin', 
      error: err.message 
    });
  }
});

exports = module.exports = router;