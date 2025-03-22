const mongoose = require('mongoose');

/**
 * Schéma pour les alertes de surveillance
 */
const alertSchema = new mongoose.Schema({
  // Identifiant de la session
  sessionId: {
    type: String,
    required: true,
    trim: true
  },
  
  // Type d'alerte
  type: {
    type: String,
    required: true,
    enum: [
      'NO_FACE_DETECTED',       // Aucun visage détecté
      'MULTIPLE_FACES',         // Plusieurs visages détectés
      'FACE_NOT_CENTERED',      // Visage mal cadré
      'SUSPICIOUS_GAZE',        // Direction du regard suspecte
      'FORBIDDEN_OBJECT',       // Objet interdit détecté
      'PAGE_LEAVE_ATTEMPT',     // Tentative de quitter la page
      'FOCUS_LOST',             // Focus perdu sur la fenêtre
      'BROWSER_SWITCH',         // Changement d'onglet/fenêtre
      'SCREEN_SHARING_STOPPED', // Partage d'écran arrêté
      'WEBCAM_DISCONNECTED',    // Webcam déconnectée
      'MODEL_LOAD_ERROR',       // Erreur de chargement des modèles
      'SYSTEM_ERROR',           // Erreur système
      'OTHER'                   // Autre
    ]
  },
  
  // Message descriptif
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Horodatage de l'alerte
  timestamp: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Niveau de sévérité
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  
  // Image de preuve (Base64)
  evidence: {
    type: String,
    default: null
  },
  
  // Chemin vers l'image sauvegardée
  evidencePath: {
    type: String,
    default: null
  },
  
  // Métadonnées supplémentaires (format flexible)
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Statut de révision
  reviewStatus: {
    type: String,
    enum: ['pending', 'reviewed', 'dismissed', 'flagged'],
    default: 'pending'
  },
  
  // Notes de révision
  reviewNotes: {
    type: String,
    default: null
  },
  
  // Utilisateur ayant effectué la révision
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Date de révision
  reviewDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Méthodes
alertSchema.methods.dismiss = function(userId, notes = '') {
  this.reviewStatus = 'dismissed';
  this.reviewNotes = notes;
  this.reviewedBy = userId;
  this.reviewDate = new Date();
  return this.save();
};

alertSchema.methods.flag = function(userId, notes = '') {
  this.reviewStatus = 'flagged';
  this.reviewNotes = notes;
  this.reviewedBy = userId;
  this.reviewDate = new Date();
  return this.save();
};

alertSchema.methods.review = function(userId, notes = '') {
  this.reviewStatus = 'reviewed';
  this.reviewNotes = notes;
  this.reviewedBy = userId;
  this.reviewDate = new Date();
  return this.save();
};

// Méthodes statiques
alertSchema.statics.getAlertsBySession = function(sessionId) {
  return this.find({ sessionId })
    .sort({ timestamp: 1 })
    .exec();
};

alertSchema.statics.getSeverityCount = function(sessionId) {
  return this.aggregate([
    { $match: { sessionId } },
    { $group: { _id: '$severity', count: { $sum: 1 } } }
  ]).exec();
};

alertSchema.statics.getAlertTypeCount = function(sessionId) {
  return this.aggregate([
    { $match: { sessionId } },
    { $group: { _id: '$type', count: { $sum: 1 } } }
  ]).exec();
};

// Hooks
alertSchema.pre('save', function(next) {
  // Déterminer automatiquement la sévérité en fonction du type si non spécifiée
  if (!this.severity) {
    switch (this.type) {
      case 'MULTIPLE_FACES':
      case 'FORBIDDEN_OBJECT':
      case 'WEBCAM_DISCONNECTED':
        this.severity = 'high';
        break;
      case 'NO_FACE_DETECTED':
      case 'PAGE_LEAVE_ATTEMPT':
      case 'BROWSER_SWITCH':
      case 'SCREEN_SHARING_STOPPED':
        this.severity = 'medium';
        break;
      case 'FACE_NOT_CENTERED':
      case 'SUSPICIOUS_GAZE':
      case 'FOCUS_LOST':
        this.severity = 'low';
        break;
      case 'MODEL_LOAD_ERROR':
      case 'SYSTEM_ERROR':
        this.severity = 'critical';
        break;
      default:
        this.severity = 'medium';
    }
  }
  next();
});

// Index
alertSchema.index({ sessionId: 1, timestamp: 1 });
alertSchema.index({ sessionId: 1, type: 1 });
alertSchema.index({ sessionId: 1, severity: 1 });
alertSchema.index({ reviewStatus: 1 });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;