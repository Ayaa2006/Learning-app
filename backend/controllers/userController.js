// controllers/userController.js
const User = require('../models/User');
const Progress = require('../models/Progress');
const Incident = require('../models/Incident');
const bcrypt = require('bcryptjs');

// Récupérer tous les utilisateurs avec pagination et filtres
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    
    // Construire la requête avec les filtres
    const query = {};
    
    if (role && role !== 'all') {
      query.role = role;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Exécuter la requête avec pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // Compter le nombre total de documents
    const count = await User.countDocuments(query);
    
    res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

// Récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message
    });
  }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, status } = req.body;
    
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    
    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Créer le nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'student',
      status: status || 'active',
      createdAt: new Date()
    });
    
    const savedUser = await newUser.save();
    
    // Ne pas renvoyer le mot de passe
    const userResponse = { ...savedUser._doc };
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, status } = req.body;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }
    }
    
    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        firstName, 
        lastName, 
        email, 
        role, 
        status,
        updatedAt: new Date() 
      },
      { new: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message
    });
  }
};

// Mettre à jour le mot de passe d'un utilisateur
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Pour les admins, pas besoin de vérifier l'ancien mot de passe
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      // Vérifier l'ancien mot de passe
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      }
    }
    
    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Mettre à jour le mot de passe
    await User.findByIdAndUpdate(
      req.params.id,
      { 
        password: hashedPassword,
        updatedAt: new Date() 
      }
    );
    
    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du mot de passe',
      error: error.message
    });
  }
};

// Mettre à jour le statut d'un utilisateur
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Vérifier si l'utilisateur existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Empêcher la modification d'un admin principal
    if (user.role === 'admin' && user.isMainAdmin && status !== 'active') {
      return res.status(403).json({ message: 'Impossible de modifier le statut de l\'administrateur principal' });
    }
    
    // Mettre à jour le statut
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: new Date() 
      },
      { new: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    // Empêcher la suppression d'un admin principal
    if (user.role === 'admin' && user.isMainAdmin) {
      return res.status(403).json({ message: 'Impossible de supprimer l\'administrateur principal' });
    }
    
    // Supprimer l'utilisateur
    await User.findByIdAndDelete(req.params.id);
    
    // Supprimer les données associées
    await Progress.deleteMany({ userId: req.params.id });
    await Incident.deleteMany({ userId: req.params.id });
    
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
};

// Récupérer les statistiques des utilisateurs
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Transformer le résultat en objet plus lisible
    const roleStats = {};
    usersByRole.forEach(role => {
      roleStats[role._id] = role.count;
    });
    
    // Utilisateurs récemment inscrits (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });
    
    res.status(200).json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      suspendedUsers,
      roleStats,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// Récupérer les incidents de triche d'un utilisateur
exports.getUserIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({ userId: req.params.id })
      .sort({ date: -1 })
      .populate('moduleId', 'title')
      .populate('examId', 'title');
    
    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des incidents',
      error: error.message
    });
  }
};

// Récupérer la progression d'un utilisateur
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.params.id })
      .populate('moduleId', 'title order')
      .sort({ 'moduleId.order': 1 });
    
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération de la progression',
      error: error.message
    });
  }
};