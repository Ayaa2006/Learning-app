// models/Module.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  thumbnail: {
    type: String,
    default: null
  },
  duration: {
    type: Number, // en minutes
    default: 0
  },
  minimumPassingScore: {
    type: Number,
    default: 70
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
});

// Index pour recherche efficace
ModuleSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Module', ModuleSchema);