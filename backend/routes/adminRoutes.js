const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminModel'); // Assure-toi que ton modèle Admin est bien défini
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'admin existe déjà
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: 'Un administrateur avec cet email existe déjà' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    // Créer un token JWT
    const token = jwt.sign(
      { id: newAdmin._id, email: newAdmin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Admin enregistré avec succès',
      token, // Retourne le token pour les futures connexions
    });
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement de l\'admin:', err); // Ajoute un log détaillé
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'admin', error: err.message });
  }
});


module.exports = router;
