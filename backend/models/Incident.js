// models/Incident.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncidentSchema = new Schema({
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
  examId: {
    type: Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_faces', 'no_face', 'window_switched', 'browser_tab_changed', 'manual_report'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  evidenceUrl: {
    type: String,
    default: null
  },
  actionTaken: {
    type: String,
    default: 'Examen échoué - Note de 0'
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolutionDate: {
    type: Date,
    default: null
  },
  resolutionNotes: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index pour recherche efficace
IncidentSchema.index({ userId: 1, date: -1 });
IncidentSchema.index({ moduleId: 1, examId: 1 });

// Vérifier si le modèle existe déjà avant de le créer
module.exports = mongoose.models.Incident || mongoose.model('Incident', IncidentSchema);