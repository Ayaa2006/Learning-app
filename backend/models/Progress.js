// models/Progress.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProgressSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  moduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Module',
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed', 'failed'],
    default: 'not_started'
  },
  startDate: {
    type: Date,
    default: null
  },
  completionDate: {
    type: Date,
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  progressPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completedCourses: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  quizzesCompleted: {
    type: Number,
    default: 0
  },
  examScore: {
    type: Number,
    default: null,
    min: 0,
    max: 100
  },
  examAttempts: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number,  // en minutes
    default: 0
  }
}, {
  timestamps: true
});

// Index composé pour rechercher efficacement le progrès d'un utilisateur pour un module spécifique
ProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

// Vérifier si le modèle existe déjà avant de le créer
module.exports = mongoose.models.Progress || mongoose.model('Progress', ProgressSchema);