// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // Vérifier si le token existe dans les headers
    let token;
    if (
      req.headers.authorization && 
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Récupérer le token du header "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // Si pas de token, renvoyer une erreur
    if (!token) {
      return res.status(401).json({ 
        message: 'Accès non autorisé, token manquant' 
      });
    }

    try {
      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur du token
      const user = await User.findById(decoded.id).select('-password');

      // Si utilisateur non trouvé
      if (!user) {
        return res.status(401).json({ 
          message: 'Utilisateur non trouvé ou token invalide' 
        });
      }

      // Vérifier le statut de l'utilisateur
      if (user.status !== 'active') {
        return res.status(403).json({
          message: 'Compte désactivé ou suspendu. Veuillez contacter l\'administrateur.'
        });
      }

      // Ajouter l'utilisateur à la requête
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error.message);
      
      return res.status(401).json({ 
        message: 'Token invalide ou expiré' 
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ 
      message: 'Erreur du serveur d\'authentification'
    });
  }
};

module.exports = authMiddleware;