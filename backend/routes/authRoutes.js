// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Assure-toi d'importer jsonwebtoken
const router = express.Router();
const User = require('../models/user.model');

// Route pour la connexion des administrateurs et professeurs
router.post('/login/staff', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Tentative de connexion:', email, role);
    
    // Trouver l'utilisateur par email et rôle
    const user = await User.findOne({ 
      email, 
      role: { $in: [role] } 
    });

    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Cette variable doit être définie dans ton .env
      { expiresIn: '24h' }
    );

    console.log('Connexion réussie, token généré');
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour la connexion des étudiants (par email et date de naissance)
router.post('/login/student', async (req, res) => {
  try {
    const { email, birthDate } = req.body;
    console.log('Tentative de connexion étudiant:', email, birthDate);
    
    // Trouver l'étudiant par email
    const user = await User.findOne({ 
      email, 
      role: 'STUDENT'
    });

    if (!user) {
      console.log('Étudiant non trouvé');
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Convertir les dates pour comparaison
    const userBirthDate = new Date(user.birthDate);
    const providedBirthDate = new Date(birthDate);
    
    // Comparer seulement jour/mois/année
    const userDateString = userBirthDate.toISOString().split('T')[0];
    const providedDateString = providedBirthDate.toISOString().split('T')[0];
    
    console.log('Date BD:', userDateString);
    console.log('Date fournie:', providedDateString);
    
    if (userDateString !== providedDateString) {
      console.log('Date de naissance incorrecte');
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Créer un token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'STUDENT' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Connexion étudiant réussie, token généré');
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: 'STUDENT'
      },
      token
    });
  } catch (error) {
    console.error('Erreur de connexion étudiant:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;