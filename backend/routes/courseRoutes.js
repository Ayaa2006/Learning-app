// routes/courseRoutes.js
const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// Route POST pour ajouter un cours
router.post("/add", async (req, res) => {
  try {
    const { title, description, content } = req.body;
    
    // Créer une nouvelle instance du modèle Course avec les données envoyées dans le corps de la requête
    const newCourse = new Course({ title, description, content });

    // Sauvegarder le cours dans la base de données MongoDB
    await newCourse.save();

    // Répondre avec le cours ajouté
    res.status(201).json({ message: "Cours ajouté avec succès", course: newCourse });
  } catch (err) {
    // Si une erreur se produit
    res.status(500).json({ message: "Erreur lors de l'ajout du cours", error: err });
  }
});

module.exports = router;
