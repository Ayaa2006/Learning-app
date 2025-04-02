const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Éviter d'écraser le modèle s'il existe déjà
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
