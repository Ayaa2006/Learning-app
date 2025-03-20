const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // Pour sécuriser le mot de passe

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});
;

// Avant de sauvegarder un admin, hacher son mot de passe
adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Générer un mot de passe haché
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Méthode pour vérifier le mot de passe lors de la connexion
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
