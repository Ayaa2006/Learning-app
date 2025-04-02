// backend/seeders/userSeeder.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

// URL directe au lieu de process.env.MONGO_URI
const mongoURI = 'mongodb://127.0.0.1:27017/skillpath';
console.log('Tentative de connexion à:', mongoURI);

// Connexion à MongoDB avec options supplémentaires
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Augmente le délai d'attente
  socketTimeoutMS: 45000, // Augmente le délai d'attente du socket
})
.then(() => console.log('MongoDB connecté pour le seeding...'))
.catch(err => {
  console.error('Erreur détaillée de connexion à la base de données:', err);
  process.exit(1);
});

// Liste des utilisateurs à créer
const users = [
  {
    name: 'Admin SkillPath',
    email: 'admin@skillpath.com',
    password: 'admin123',
    role: 'ADMIN'
  },
  {
    name: 'Professeur SkillPath',
    email: 'prof@skillpath.com',
    password: 'prof123',
    role: 'TEACHER'
  },
  {
    name: 'Étudiant SkillPath',
    email: 'etudiant@skillpath.com',
    birthDate: new Date('2000-01-01'),
    role: 'STUDENT'
  },
  {
    name: 'Étudiant SkillPath',
    email: 'aya@uca.ac.com',
    birthDate: new Date('2006-01-30'),
    role: 'STUDENT'
  }
];

// Fonction pour hasher les mots de passe et enregistrer les utilisateurs
async function seedUsers() {
  try {
    // Supprimer tous les utilisateurs existants
    await User.deleteMany({});
    console.log('Utilisateurs existants supprimés');
    
    // Créer les nouveaux utilisateurs
    for (const user of users) {
      // Hasher le mot de passe si nécessaire (pas pour les étudiants)
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      
      // Créer l'utilisateur
      await User.create(user);
      console.log(`Utilisateur créé: ${user.name} (${user.role})`);
    }
    
    console.log('Seeding terminé avec succès');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors du seeding:', error);
    process.exit(1);
  }
}

// Définir un temps d'attente avant d'exécuter le seeding pour s'assurer que la connexion est établie
setTimeout(() => {
  seedUsers();
}, 1000);