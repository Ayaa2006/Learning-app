const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Importer la configuration
dotenv.config();

// Importer les routes
const authRoutes = require('./routes/auth.routes');
const examRoutes = require('./routes/exam.routes');
const proctorRoutes = require('./routes/proctor.routes');

// Importer les utilitaires
const logger = require('./services/logger.service');
const { connectDB } = require('./utils/db');

// Créer l'application Express
const app = express();

// Créer le serveur HTTP
const server = http.createServer(app);

// Configurer Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware pour limiter les requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limiter chaque IP à 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Trop de requêtes de cette adresse IP, veuillez réessayer après 15 minutes'
});

// Middleware globaux
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(limiter);

// Connecter à la base de données
connectDB();

// Gérer les événements Socket.IO
io.on('connection', (socket) => {
  logger.info(`Client connecté: ${socket.id}`);
  
  // Rejoindre une salle spécifique pour un examen
  socket.on('join-exam', (examId) => {
    socket.join(`exam:${examId}`);
    logger.info(`Client ${socket.id} a rejoint l'examen ${examId}`);
  });
  
  // Gérer les alertes de surveillance
  socket.on('proctor-alert', (data) => {
    // Émettre l'alerte aux administrateurs/superviseurs
    io.to(`admin:${data.examId}`).emit('proctor-alert', data);
    logger.info(`Alerte de surveillance reçue pour l'examen ${data.examId}`);
  });
  
  // Gérer la déconnexion
  socket.on('disconnect', () => {
    logger.info(`Client déconnecté: ${socket.id}`);
  });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/proctor', proctorRoutes);

// Route pour vérifier que l'API est en cours d'exécution
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Route introuvable',
    path: req.path
  });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  logger.error(`Erreur: ${err.message}`);
  logger.error(err.stack);
  
  res.status(err.status || 500).json({
    message: err.message || 'Une erreur est survenue sur le serveur',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Serveur en cours d'exécution sur le port ${PORT}`);
});

// Gérer les erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Ne pas fermer l'application, juste logger l'erreur
});

module.exports = { app, server };