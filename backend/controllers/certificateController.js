const Certificate = require("../models/Certificate");
const User = require("../models/user.model");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");



exports.getCompletedUsers = async (req, res) => {
  try {
    const users = await User.find({ programCompleted: true });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.generateCertificate = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user || !user.programCompleted) {
      return res.status(400).json({ message: "Utilisateur non éligible" });
    }

    const certificatePath = path.join(__dirname, `../certificates/${userId}.pdf`);
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(certificatePath));

    doc.fontSize(24).text("Certificat de Réussite", { align: "center" });
    doc.moveDown();
    doc.fontSize(16).text(`Décerné à : ${user.nom}`, { align: "center" });
    doc.text(`Email : ${user.email}`, { align: "center" });
    doc.text(`Date : ${new Date().toLocaleDateString()}`, { align: "center" });
    doc.moveDown();
    doc.text("Félicitations pour l'achèvement du programme !", { align: "center" });

    doc.end();

    const newCertificate = new Certificate({
      user: userId,
      url: `/certificates/${userId}.pdf`,
    });

    await newCertificate.save();

    res.json({ message: "Certificat généré avec succès", url: newCertificate.url });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la génération", error });
  }
};
