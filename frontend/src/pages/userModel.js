const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// Empêche la redéfinition du modèle
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
