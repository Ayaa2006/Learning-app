// ./backend/scripts/createAdmin.js
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Vérification du fichier .env
const envPath = path.resolve(__dirname, '../.env');
console.log('Cherche .env à:', envPath);
console.log('Ce fichier existe:', fs.existsSync(envPath));

// Tentative de chargement des variables d'environnement
dotenv.config({ path: envPath });
console.log('MONGO_URI après chargement:', process.env.MONGO_URI);

// URI de connexion MongoDB - utiliser l'environnement ou une valeur par défaut
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/elearningDB';
console.log('URI de connexion utilisée:', MONGO_URI);

async function createAdmin() {
  try {
    // Connexion à la base de données
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connexion à MongoDB établie avec succès');
    
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const admin = new User({
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        isMainAdmin: true,
        createdAt: new Date()
      });
      
      await admin.save();
      console.log('Administrateur créé avec succès!');
    } else {
      console.log('Un administrateur existe déjà');
    }
    
    // Fermer la connexion à la base de données
    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée');
    
  } catch (error) {
    console.error('Erreur:', error);
  }
}

// Exécuter la fonction
createAdmin();