/**
 * Configuration globale du serveur
 */

require('dotenv').config();

module.exports = {
  // Configuration de l'environnement
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  
  // Configuration de la base de données
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/e-learning-proctoring',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // Configuration JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  },
  
  // Configuration de la sécurité
  security: {
    bcryptSaltRounds: 10,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // Limite par IP
    }
  },
  
  // Configuration des uploads
  uploads: {
    directory: process.env.UPLOAD_DIR || 'uploads',
    maxSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10 MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  },
  
  // Configuration du système de surveillance
  proctoring: {
    alertThreshold: 3, // Nombre d'alertes avant notification
    captureSaveDirectory: process.env.CAPTURE_DIR || 'captures',
    captureQuality: 0.7, // Qualité des captures JPEG (0-1)
    forbiddenObjects: ['cell phone', 'book', 'laptop', 'person']
  },
  
  // URLs
  urls: {
    client: process.env.CLIENT_URL || 'http://localhost:3000',
    server: process.env.SERVER_URL || 'http://localhost:5000'
  },
  
  // Configuration du logger
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    directory: process.env.LOG_DIR || 'logs'
  },
  
  // Configuration des emails
  email: {
    from: process.env.EMAIL_FROM || 'noreply@e-learning-proctoring.com',
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    }
  }
};
