// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Middleware pour vérifier l'authentification
exports.protect = async (req, res, next) => {
  let token;

  // Vérifier si l'en-tête Authorization est présent et commence par 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token
      token = req.headers.authorization.split(' ')[1];
      console.log('Token reçu:', token);

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token décodé:', decoded);

      // Ajouter l'utilisateur à la requête
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }

  if (!token) {
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
  };
};