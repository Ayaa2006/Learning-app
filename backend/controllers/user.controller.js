// backend/controllers/user.controller.js
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, birthDate, speciality } = req.body;

    // Vérifier si l'email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Données de base de l'utilisateur
    const userData = {
      name,
      email,
      role
    };

    // Ajouter les données spécifiques selon le rôle
    if (role === 'STUDENT') {
      // Pour les étudiants, la date de naissance est obligatoire
      if (!birthDate) {
        return res.status(400).json({ message: 'La date de naissance est obligatoire pour les étudiants' });
      }
      userData.birthDate = new Date(birthDate);
    } else {
      // Pour les professeurs et administrateurs, le mot de passe est obligatoire
      if (!password) {
        return res.status(400).json({ message: 'Le mot de passe est obligatoire pour les professeurs et administrateurs' });
      }
      
      // Hacher le mot de passe
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(password, salt);
      
      // Ajouter la spécialité pour les professeurs
      if (role === 'TEACHER' && speciality) {
        userData.speciality = speciality;
      }
    }

    // Créer l'utilisateur
    const user = new User(userData);
    await user.save();

    // Envoyer la réponse sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, birthDate, speciality } = req.body;
    
    // Trouver l'utilisateur à mettre à jour
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Si l'email est modifié, vérifier qu'il n'est pas déjà utilisé
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
    }
    
    // Mettre à jour les champs de base
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    
    // Mettre à jour les champs spécifiques selon le rôle
    if (role === 'STUDENT' && birthDate) {
      user.birthDate = new Date(birthDate);
    }
    
    if (role === 'TEACHER' && speciality) {
      user.speciality = speciality;
    }
    
    await user.save();
    
    // Envoyer la réponse sans le mot de passe
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json(userResponse);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le mot de passe d'un utilisateur
exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Le mot de passe est requis' });
    }
    
    // Trouver l'utilisateur à mettre à jour
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier que l'utilisateur n'est pas un étudiant (qui n'a pas de mot de passe)
    if (user.role === 'STUDENT') {
      return res.status(400).json({ message: 'Les étudiants n\'ont pas de mot de passe' });
    }
    
    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();
    
    res.json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le statut d'un utilisateur (actif/inactif)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (status !== 'actif' && status !== 'inactif') {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    
    // Mettre à jour le statut de l'utilisateur
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir des statistiques sur les utilisateurs
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'STUDENT' });
    const teacherCount = await User.countDocuments({ role: 'TEACHER' });
    const adminCount = await User.countDocuments({ role: 'ADMIN' });
    
    // Utilisateurs récents (derniers 30 jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.json({
      totalUsers,
      studentCount,
      teacherCount,
      adminCount,
      recentUsers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Endpoints additionnels qui seront implémentés ultérieurement
exports.getUserIncidents = async (req, res) => {
  // Cette fonction sera implémentée ultérieurement
  res.json({ message: 'Fonction non implémentée', incidents: [] });
};

exports.getUserProgress = async (req, res) => {
  // Cette fonction sera implémentée ultérieurement
  res.json({ message: 'Fonction non implémentée', progress: {} });
};