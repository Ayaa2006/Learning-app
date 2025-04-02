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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);