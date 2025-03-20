const express = require("express");
const Course = require("../models/Course");
const User = require("../models/User"); // Ajout du modèle User
const { protect } = require("../middleware/authMiddleware"); // Middleware d'authentification

const router = express.Router();

// ➤ Récupérer tous les cours disponibles
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ➤ Inscription d'un étudiant à un cours
router.post("/enroll/:courseId", protect, async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: "Étudiant introuvable" });

    // Vérifier si l'étudiant est déjà inscrit
    if (student.courses.includes(req.params.courseId)) {
      return res.status(400).json({ message: "Déjà inscrit à ce cours" });
    }

    // Ajouter le cours à la liste de l'étudiant
    student.courses.push(req.params.courseId);
    await student.save();

    res.json({ message: "Inscription réussie !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
