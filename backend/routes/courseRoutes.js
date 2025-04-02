// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');

// Contrôleurs (à implémenter)
const courseController = {
  getAllCourses: (req, res) => {
    // Exemple de réponse
    res.json({ 
      success: true, 
      data: [
        { id: 1, title: 'Introduction à React', description: 'Apprendre les bases de React' },
        { id: 2, title: 'Node.js pour débutants', description: 'Introduction au développement backend avec Node.js' }
      ] 
    });
  },
  
  getCourseById: (req, res) => {
    res.json({ 
      success: true, 
      data: { 
        id: req.params.id, 
        title: 'Introduction à React', 
        description: 'Apprendre les bases de React',
        content: 'Contenu détaillé du cours...' 
      } 
    });
  },
  
  createCourse: (req, res) => {
    res.status(201).json({ 
      success: true, 
      data: { 
        id: Date.now(), 
        ...req.body 
      },
      message: 'Cours créé avec succès' 
    });
  },
  
  updateCourse: (req, res) => {
    res.json({ 
      success: true, 
      data: { 
        id: req.params.id, 
        ...req.body 
      },
      message: 'Cours mis à jour avec succès' 
    });
  },
  
  deleteCourse: (req, res) => {
    res.json({ 
      success: true, 
      message: 'Cours supprimé avec succès' 
    });
  }
};

// Routes pour les cours
// Routes publiques ou avec authentification simple
router.get('/', protect, courseController.getAllCourses);
router.get('/:id', protect, courseController.getCourseById);

// Routes protégées pour les enseignants et administrateurs
router.post('/', protect, authorize('TEACHER', 'ADMIN'), courseController.createCourse);
router.put('/:id', protect, authorize('TEACHER', 'ADMIN'), courseController.updateCourse);
router.delete('/:id', protect, authorize('ADMIN'), courseController.deleteCourse);

module.exports = router;