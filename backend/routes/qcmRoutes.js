const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// ➤ Configuration de Multer pour gérer l'upload des fichiers
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ➤ Route pour téléverser un QCM en PDF
router.post("/upload-qcm", upload.single("qcmFile"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Aucun fichier sélectionné." });
  res.json({ message: "Fichier téléversé avec succès !" });
});

module.exports = router;
