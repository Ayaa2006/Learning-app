// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use((req, res, next) => {
  console.log(`Requête: ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.error('Erreur MongoDB:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');


// Redirections pour le frontend
app.post('/auth/login/staff', (req, res) => {
  console.log('Redirection de /auth/login/staff vers /api/auth/login/staff');
  req.url = '/login/staff';
  authRoutes(req, res);
});

app.post('/auth/login/student', (req, res) => {
  console.log('Redirection de /auth/login/student vers /api/auth/login/student');
  req.url = '/login/student';
  authRoutes(req, res);
});

// Utilisation des routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Route de test pour vérifier que tout fonctionne
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionne correctement' });
});

// Dashboard routes
app.get('/api/admin/dashboard', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Dashboard admin accessible',
    data: {
      stats: {
        totalUsers: 120,
        totalCourses: 15,
        activeUsers: 80
      }
    }
  });
});

app.get('/api/teacher/dashboard', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Dashboard professeur accessible',
    data: {
      stats: {
        myCourses: 5,
        myStudents: 45,
        pendingAssignments: 12
      }
    }
  });
});

app.get('/api/student/dashboard', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Dashboard étudiant accessible',
    data: {
      stats: {
        enrolledCourses: 3,
        completedCourses: 1,
        upcomingExams: 2
      }
    }
  });
});

// Route catch-all pour les API non implémentées
app.all('/api/*', (req, res) => {
  console.log('Route API non implémentée:', req.method, req.url);
  res.json({ 
    success: false, 
    message: 'Cette fonctionnalité sera bientôt disponible' 
  });
});

// Ajoute ceci avant le middleware 404
app.use((req, res, next) => {
  console.log('Route non trouvée:', req.method, req.url);
  next();
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

module.exports = app; // Pour les tests