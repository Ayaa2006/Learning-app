const express = require("express");
const router = express.Router();

// Exemple de route POST
router.post("/ajouter", (req, res) => {
  const data = req.body;  // Données envoyées avec la requête POST
  console.log("Données reçues : ", data);

  // Logique de traitement ici
  res.status(201).json({ message: "Progress ajouté avec succès", progress: data });
});

module.exports = router;
