const mongoose = require('mongoose');

/**
 * Schéma pour les sessions de surveillance d'examen
 */
const sessionSchema = new mongoose.Schema({
  // Identifiant unique de la session
  sessionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Références aux entités liées
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Horodatages de la session
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  endTime: {
    type: Date,
    default: null
  },
  
  // Statut de la session
  status: {
    type: String,
    enum: ['active', 'completed', 'terminated', 'flagged'],
    default: 'active'
  },
  
  // Information sur l'environnement
  environment: {
    userAgent: String,
    screenResolution: String,
    ipAddress: String,
    browser: String,
    os: String,
    timezone: String
  },
  
  // Statistiques de la session
  stats: {
    totalAlerts: {
      type: Number,
      default: 0
    },
    alertsByType: {
      type: Map,
      of: Number,
      default: () => new Map()
    },
    maxConsecutiveAlerts: {
      type: Number,
      default: 0
    },
    browserSwitches: {
      type: Number,
      default: 0
    },
    focusLostCount: {
      type: Number,
      default: 0
    },
    totalFocusLostTime: {
      type: Number, // En secondes
      default: 0
    }
  },
  
  // Notes et commentaires
  notes: {
    type: String,
    trim: true
  },
  
  // Indique si la session a été revue par un superviseur
  reviewed: {
    type: Boolean,
    default: false
  },
  
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  reviewDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
sessionSchema.virtual('duration').get(function() {
  if (!this.endTime) return null;
  
  return Math.round((this.endTime - this.startTime) / 1000); // En secondes
});

sessionSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

sessionSchema.virtual('alerts', {
  ref: 'Alert',
  localField: 'sessionId',
  foreignField: 'sessionId'
});

// Méthodes
sessionSchema.methods.finishSession = async function(status = 'completed') {
  this.endTime = new Date();
  this.status = status;
  return this.save();
};

sessionSchema.methods.updateStats = async function(alerts) {
  // Mettre à jour les statistiques en fonction des alertes
  this.stats.totalAlerts = alerts.length;
  
  // Calculer les alertes par type
  const alertsByType = new Map();
  for (const alert of alerts) {
    const count = alertsByType.get(alert.type) || 0;
    alertsByType.set(alert.type, count + 1);
  }
  this.stats.alertsByType = alertsByType;
  
  // Calculer le plus grand nombre d'alertes consécutives
  let maxConsecutive = 0;
  let currentConsecutive = 0;
  let lastAlertTime = null;
  
  const sortedAlerts = [...alerts].sort((a, b) => a.timestamp - b.timestamp);
  
  for (const alert of sortedAlerts) {
    if (!lastAlertTime || alert.timestamp - lastAlertTime < 30000) { // 30 secondes
      currentConsecutive++;
    } else {
      currentConsecutive = 1;
    }
    
    maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
    lastAlertTime = alert.timestamp;
  }
  
  this.stats.maxConsecutiveAlerts = maxConsecutive;
  
  return this.save();
};

// Hooks
sessionSchema.pre('save', function(next) {
  if (this.isNew) {
    // Initialiser les statistiques pour une nouvelle session
    this.stats = {
      totalAlerts: 0,
      alertsByType: new Map(),
      maxConsecutiveAlerts: 0,
      browserSwitches: 0,
      focusLostCount: 0,
      totalFocusLostTime: 0
    };
  }
  next();
});

// Index
sessionSchema.index({ sessionId: 1 }, { unique: true });
sessionSchema.index({ exam: 1, student: 1 });
sessionSchema.index({ startTime: -1 });
sessionSchema.index({ status: 1 });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;