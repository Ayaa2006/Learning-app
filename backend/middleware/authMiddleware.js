// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware pour vérifier l'authentification
exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token reçu et traité');
      
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token décodé avec succès:', decoded);
      
      // Chercher l'utilisateur dans la base de données
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.log('Utilisateur non trouvé avec ID:', decoded.id);
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }
      
      // Vérifier que le rôle correspond
      if (user.role !== decoded.role) {
        console.log('Rôle de token invalide');
        return res.status(401).json({ message: 'Token non valide pour ce rôle' });
      }
      
      // Ajouter l'utilisateur à la requête
      req.user = {
        id: user._id,
        role: user.role,
        email: user.email
      };
      
      console.log('Utilisateur authentifié:', user.name);
      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  } else {
    console.log('Pas de token fourni');
    return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
  }
};

// Middleware pour vérifier les rôles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Accès refusé, autorisation insuffisante'
      });
    }
    next();
  }
};

// Middleware pour vérifier que l'utilisateur est un administrateur
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Accès refusé, privilèges administrateur requis' });
};