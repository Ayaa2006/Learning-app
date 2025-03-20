// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

// Middleware pour vérifier que l'utilisateur est un administrateur
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Accès refusé, privilèges administrateur requis' });
};

// Routes accessibles uniquement aux administrateurs
router.use(authMiddleware);

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