const express = require("express");
const app = express();

// Permettre l’accès aux fichiers stockés dans 'uploads/'
app.use("/uploads", express.static("uploads"));

app.listen(5000, () => console.log("Serveur lancé sur le port 5000"));
