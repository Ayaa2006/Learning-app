// backend/models/user.model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String, 
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() {
      return this.role !== 'STUDENT';
    }
  },
  birthDate: {
    type: Date,
    required: function() {
      return this.role === 'STUDENT';
    }
  },
  role: {
    type: String,
    enum: ['STUDENT', 'TEACHER', 'ADMIN'],
    required: true
  },
  status: {
    type: String,
    enum: ['actif', 'inactif'],
    default: 'actif'
  },
  speciality: {
    type: String,
    required: function() {
      return this.role === 'TEACHER';
    }
  },
  lastLogin: {
    type: Date
  },
  progress: {
    type: Number,
    default: 0
  },
  coursesCompleted: {
    type: Number,
    default: 0
  },
  certifications: {
    type: Number,
    default: 0
  },
  coursesCreated: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Créer des index pour améliorer les performances des requêtes fréquentes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);