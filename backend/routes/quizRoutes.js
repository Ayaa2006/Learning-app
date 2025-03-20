const express = require("express");
const router = express.Router();

// Exemple de route POST avec une fonction de callback
router.post("/ajouter", (req, res) => {
  const quizData = req.body;  // Les données envoyées dans la requête POST
  if (!quizData) {
    return res.status(400).json({ message: "Aucune donnée envoyée" });
  }
  
  // Logique pour ajouter un quiz dans la base de données ici...
  
  res.status(201).json({ message: "Quiz ajouté avec succès", quiz: quizData });
});

// Autres routes pour GET, PUT, DELETE, etc.

module.exports = router;
