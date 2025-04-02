const User = require('../models/user.model');
const bcrypt = require('bcryptjs'); // Pour hacher les mots de passe
const jwt = require('jsonwebtoken'); // Pour générer des tokens d'authentification

// Clé secrète pour le JWT (à stocker dans un fichier .env)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// ➤ 1️⃣ Inscription d'un utilisateur
exports.register = async (req, res) => {
    try {
        const { nom, email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({ nom, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur inscrit avec succès !' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// ➤ 2️⃣ Connexion d'un utilisateur
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Générer un token JWT
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ message: 'Connexion réussie', token, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// ➤ 3️⃣ Récupérer tous les utilisateurs (admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclure le mot de passe
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// ➤ 4️⃣ Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
