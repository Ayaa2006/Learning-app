const express = require("express");
const router = express.Router();
const Pdf = require("../models/Pdf");
const multer = require("multer");

// Configurer Multer pour stocker les fichiers PDF
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// ➤ Télécharger un PDF
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Aucun fichier envoyé" });

    const newPdf = new Pdf({
      fileName: req.file.filename,
      filePath: req.file.path,
      uploadedBy: req.body.uploadedBy,
    });

    await newPdf.save();
    res.status(201).json({ message: "PDF envoyé avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ➤ Lister les PDFs envoyés
router.get("/list", async (req, res) => {
  try {
    const pdfs = await Pdf.find();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
