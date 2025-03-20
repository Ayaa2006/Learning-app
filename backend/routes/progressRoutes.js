const express = require("express");
const router = express.Router();

// Exemple de route POST avec une fonction de callback
router.post("/ajouter", (req, res) => {
  // Logique pour ajouter des progrès
  console.log(req.body); // Affiche les données envoyées dans la requête

  // Exemple de réponse après traitement des données
  res.status(201).json({ message: "Progrès ajoutés avec succès", progress: req.body });
});

// Autres routes pour GET, PUT, DELETE, etc.

module.exports = router;
