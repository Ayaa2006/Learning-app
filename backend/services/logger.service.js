const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// S'assurer que le répertoire de logs existe
const logDir = config.logger.directory;
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Définir les formats
const { combine, timestamp, printf, colorize, align } = winston.format;

// Format personnalisé
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  const metaString = Object.keys(metadata).length 
    ? JSON.stringify(metadata, null, 2) 
    : '';
    
  return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaString}`;
});

// Créer le logger
const logger = winston.createLogger({
  level: config.logger.level,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    logFormat
  ),
  transports: [
    // Écrire tous les logs dans application.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'application.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    }),
    
    // Écrire les logs d'erreur dans error.log
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Ajouter la console en développement
if (config.env !== 'production') {
  logger.add(new winston.transports.Console({
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'HH:mm:ss' }),
      align(),
      logFormat
    )
  }));
}

// Fonction pour logger les requêtes HTTP
logger.logRequest = (req, res, next) => {
  const start = Date.now();
  
  // Une fois la réponse terminée
  res.on('finish', () => {
    const duration = Date.now() - start;
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`;
    
    // Déterminer le niveau de log en fonction du statut
    if (res.statusCode >= 500) {
      logger.error(message, { 
        ip: req.ip, 
        userAgent: req.get('User-Agent')
      });
    } else if (res.statusCode >= 400) {
      logger.warn(message, { 
        ip: req.ip
      });
    } else {
      logger.info(message);
    }
  });
  
  next();
};

// Fonction pour logger les erreurs avec contexte
logger.logError = (err, req) => {
  logger.error(`${err.name}: ${err.message}`, {
    stack: err.stack,
    method: req?.method,
    url: req?.originalUrl,
    body: req?.body,
    ip: req?.ip,
    user: req?.user?.id
  });
};

module.exports = logger;