const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté pour le seeding'))
  .catch(err => console.error('Erreur MongoDB:', err));

const createUsers = async () => {
  try {
    // Hasher le mot de passe pour les tests
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    // Créer ou mettre à jour les utilisateurs
    const users = [
      {
        email: 'etudiant1@uca.ac.ma',
        birthDate: new Date('1998-05-15'),
        firstName: 'Étudiant1',
        lastName: 'Nom1',
        role: 'student',
        status: 'active'
      },
      {
        email: 'etudiant2@uca.ac.ma',
        birthDate: new Date('1999-07-20'),
        firstName: 'Étudiant2',
        lastName: 'Nom2',
        role: 'student',
        status: 'active'
      },
      {
        email: 'etudiant3@uca.ac.ma',
        birthDate: new Date('2000-03-10'),
        firstName: 'Étudiant3',
        lastName: 'Nom3',
        role: 'student',
        status: 'active'
      },
      {
        email: 'admin@uca.ac.ma',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Principal',
        role: 'admin',
        adminType: 'admin',
        status: 'active'
      },
      {
        email: 'prof1@uca.ac.ma',
        password: hashedPassword,
        firstName: 'Professeur',
        lastName: 'Premier',
        role: 'admin',
        adminType: 'prof',
        specialization: 'Informatique',
        status: 'active'
      },
      {
        email: 'prof2@uca.ac.ma',
        password: hashedPassword,
        firstName: 'Professeur2',
        lastName: 'Exemple2',
        role: 'admin',
        adminType: 'prof',
        specialization: 'Mathématiques',
        status: 'active'
      }
    ];
    
    // Pour chaque utilisateur, vérifier s'il existe, sinon le créer
    for (const userData of users) {
      // Rechercher par email
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`L'utilisateur ${userData.email} existe déjà, mise à jour...`);
        
        // Mettre à jour les champs sans écraser le mot de passe s'il existe déjà
        if (!userData.password && existingUser.password) {
          delete userData.password;
        }
        
        await User.findByIdAndUpdate(existingUser._id, userData);
      } else {
        console.log(`Création de l'utilisateur ${userData.email}...`);
        await User.create(userData);
      }
    }
    
    console.log('Utilisateurs créés/mis à jour avec succès!');
    console.log('-----------------------------------');
    console.log('Comptes étudiants pour tests:');
    console.log('- etudiant1@uca.ac.ma / Date: 1998-05-15');
    console.log('- etudiant2@uca.ac.ma / Date: 1999-07-20');
    console.log('- etudiant3@uca.ac.ma / Date: 2000-03-10');
    console.log('-----------------------------------');
    console.log('Comptes administrateurs pour tests:');
    console.log('- admin@uca.ac.ma / password123');
    console.log('- prof1@uca.ac.ma / password123');
    console.log('- prof2@uca.ac.ma / password123');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Erreur:', error);
    mongoose.disconnect();
  }
};

createUsers();