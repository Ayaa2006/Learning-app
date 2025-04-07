// routes/userRoutes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/authMiddleware');

// Middleware pour vérifier que l'utilisateur est un administrateur
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Accès refusé, privilèges administrateur requis' });
};

// Routes accessibles uniquement aux administrateurs
router.use(protect);
// Route pour récupérer le profil de l'utilisateur connecté

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/profile', async (req, res) => {
  try {
    console.log("ID utilisateur demandé:", req.user.id);
    
    // Récupérer l'utilisateur complet
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('Utilisateur non trouvé pour ID:', req.user.id);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    console.log('Profil trouvé pour:', user.name);
    
    // Renvoyer l'utilisateur complet
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
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