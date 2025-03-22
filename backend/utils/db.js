const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../services/logger.service');

/**
 * Connecter à la base de données MongoDB
 */
const connectDB = async () => {
  try {
    // Configuration supplémentaire pour Mongoose
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(config.db.uri, config.db.options);
    
    logger.info(`MongoDB connecté: ${conn.connection.host}`);
    
    // Écouter les événements de connexion
    mongoose.connection.on('error', (err) => {
      logger.error(`Erreur de connexion MongoDB: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB déconnecté. Tentative de reconnexion...');
    });
    
    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnecté');
    });
    
    // Gestion propre de la fermeture
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB déconnecté en raison de l\'arrêt de l\'application');
      process.exit(0);
    });
    
    return conn;
  } catch (error) {
    logger.error(`Erreur de connexion à MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Vérifier l'état de la connexion à la base de données
 */
const checkDBConnection = () => {
  const state = mongoose.connection.readyState;
  
  switch (state) {
    case 0:
      return { status: 'disconnected', message: 'Déconnecté' };
    case 1:
      return { status: 'connected', message: 'Connecté' };
    case 2:
      return { status: 'connecting', message: 'En cours de connexion' };
    case 3:
      return { status: 'disconnecting', message: 'En cours de déconnexion' };
    default:
      return { status: 'unknown', message: 'État inconnu' };
  }
};

/**
 * Convertir un ID en ObjectId MongoDB
 */
const toObjectId = (id) => {
  if (!id) return null;
  
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    logger.error(`Conversion ObjectId échouée pour l'ID: ${id}`);
    return null;
  }
};

module.exports = {
  connectDB,
  checkDBConnection,
  toObjectId
};