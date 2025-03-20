// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student'],
    default: 'student'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  isMainAdmin: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: null
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  }
}, {
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      // Créer un champ fullName qui combine firstName et lastName
      ret.fullName = ret.firstName + ' ' + ret.lastName;
      
      // Supprimer le champ password pour la sécurité
      delete ret.password;
      
      return ret;
    }
  },
  toObject: {
    virtuals: true
  }
});

// Créer un index composite pour la recherche efficace
UserSchema.index({ firstName: 'text', lastName: 'text', email: 'text' });

// Vérifier si le modèle existe déjà avant de le créer
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);