// server.js - Point d'entrée du backend
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Chargement des variables d'environnement
dotenv.config();

// Création de l'application Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dossier pour les uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGO_URI, {  // Changé MONGODB_URI en MONGO_URI
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connexion à MongoDB établie avec succès'))
.catch(err => {
  console.error('Erreur de connexion à MongoDB:', err.message);
  process.exit(1);
});

// Routes API - Commentons temporairement celles qui causent problème
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/users', require('./routes/userRoutes'));
// app.use('/api/modules', require('./routes/moduleRoutes'));
// app.use('/api/courses', require('./routes/courseRoutes'));
// app.use('/api/exams', require('./routes/examRoutes'));
// app.use('/api/progress', require('./routes/progressRoutes'));
// app.use('/api/certificates', require('./routes/certificateRoutes'));

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'API de la plateforme E-Learning' });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Middleware de gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || 'Erreur serveur',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});