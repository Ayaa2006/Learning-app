// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, isAdmin } = require('../middlewares/authMiddleware'); // Modification ici

// Routes protégées nécessitant authentification
router.use(auth);

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