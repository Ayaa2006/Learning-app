// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model'); // Ajout de l'import User

const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

// Middleware pour vérifier que l'utilisateur est un administrateur
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') { // Correction du rôle en majuscules
    return next();
  }
  return res.status(403).json({ message: 'Accès refusé, privilèges administrateur requis' });
};

// Route pour récupérer le profil de l'utilisateur connecté
// Appliquer protect UNIQUEMENT à cette route
router.get('/profile', protect, async (req, res) => {
  try {
    console.log('ID utilisateur dans le token:', req.user.id);
    console.log('Token headers:', req.headers.authorization);
    
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      console.log('AUCUN utilisateur trouvé pour ID:', req.user.id);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    console.log('Utilisateur trouvé:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
    res.json(user);
  } catch (error) {
    console.error('Erreur CRITIQUE de profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});




// Routes de gestion des utilisateurs (administrateurs uniquement)
router.get('/', isAdmin, userController.getAllUsers);
router.post('/', isAdmin, userController.createUser);
router.get('/stats', isAdmin, userController.getUserStats);
router.get('/:id', isAdmin, userController.getUserById);
router.put('/:id', isAdmin, userController.updateUser);
router.patch('/:id/password', isAdmin, userController.updatePassword);
router.patch('/:id/status', isAdmin, userController.updateStatus);
router.delete('/:id', isAdmin, userController.deleteUser);
router.get('/:id/incidents', isAdmin, userController.getUserIncidents);
router.get('/:id/progress', isAdmin, userController.getUserProgress);

module.exports = router;