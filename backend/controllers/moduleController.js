// controllers/moduleController.js
const Module = require('../models/Module');
const Course = require('../models/Course');
const Exam = require('../models/Exam');
const Progress = require('../models/Progress');
const mongoose = require('mongoose');

// Obtenir tous les modules avec pagination et filtres
exports.getAllModules = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sort = 'order' } = req.query;
    
    // Construire la requête avec les filtres
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    // Déterminer le tri
    let sortOption = {};
    if (sort === 'order') {
      sortOption = { order: 1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    } else if (sort === 'createdAt') {
      sortOption = { createdAt: -1 };
    }
    
    // Exécuter la requête avec pagination
    const modules = await Module.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    // Compter le nombre total de documents
    const count = await Module.countDocuments(query);
    
    res.status(200).json({
      modules,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalModules: count
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des modules',
      error: error.message
    });
  }
};

// Obtenir un module par son ID
exports.getModuleById = async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');
    
    if (!module) {
      return res.status(404).json({ message: 'Module non trouvé' });
    }
    
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération du module',
      error: error.message
    });
  }
};

// Créer un nouveau module
exports.createModule = async (req, res) => {
  try {
    const { title, description, order, status, thumbnail, duration, minimumPassingScore } = req.body;
    
    // Vérifier si un module avec le même ordre existe déjà
    const existingModule = await Module.findOne({ order });
    if (existingModule) {
      return res.status(400).json({ message: 'Un module avec cet ordre existe déjà' });
    }
    
    // Créer le nouveau module
    const newModule = new Module({
      title,
      description,
      order,
      status: status || 'draft',
      thumbnail,
      duration: duration || 0,
      minimumPassingScore: minimumPassingScore || 70,
      createdBy: req.user.id,
      createdAt: new Date()
    });
    
    const savedModule = await newModule.save();
    
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la création du module',
      error: error.message
    });
  }
};

// Mettre à jour un module
exports.updateModule = async (req, res) => {
  try {
    const { title, description, order, status, thumbnail, duration, minimumPassingScore } = req.body;
    
    // Vérifier si le module existe
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module non trouvé' });
    }
    
    // Vérifier si un autre module a déjà cet ordre
    if (order !== module.order) {
      const existingModule = await Module.findOne({ order, _id: { $ne: req.params.id } });
      if (existingModule) {
        return res.status(400).json({ message: 'Un autre module avec cet ordre existe déjà' });
      }
    }
    
    // Mettre à jour le module
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        order,
        status,
        thumbnail,
        duration,
        minimumPassingScore,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('createdBy', 'firstName lastName');
    
    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la mise à jour du module',
      error: error.message
    });
  }
};

// Supprimer un module
exports.deleteModule = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Vérifier si le module existe
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module non trouvé' });
    }
    
    // Vérifier les dépendances (cours et examens)
    const coursesCount = await Course.countDocuments({ moduleId: req.params.id });
    const examsCount = await Exam.countDocuments({ moduleId: req.params.id });
    
    if (coursesCount > 0 || examsCount > 0) {
      return res.status(400).json({ 
        message: 'Impossible de supprimer ce module car il contient des cours ou des examens',
        coursesCount,
        examsCount
      });
    }
    
    // Supprimer le module
    await Module.findByIdAndDelete(req.params.id, { session });
    
    // Supprimer les données de progression associées
    await Progress.deleteMany({ moduleId: req.params.id }, { session });
    
    await session.commitTransaction();
    
    res.status(200).json({ message: 'Module supprimé avec succès' });
  } catch (error) {
    await session.abortTransaction();
    
    res.status(500).json({
      message: 'Erreur lors de la suppression du module',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

// Obtenir les contenus d'un module (cours et examens)
exports.getModuleContents = async (req, res) => {
  try {
    // Vérifier si le module existe
    const module = await Module.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module non trouvé' });
    }
    
    // Récupérer les cours du module
    const courses = await Course.find({ moduleId: req.params.id })
      .sort({ order: 1 });
    
    // Récupérer l'examen du module
    const exam = await Exam.findOne({ moduleId: req.params.id });
    
    res.status(200).json({
      module,
      courses,
      exam
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des contenus du module',
      error: error.message
    });
  }
};

// Modifier l'ordre des modules
exports.reorderModules = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { moduleOrders } = req.body;
    
    // Vérifier que moduleOrders est un tableau valide
    if (!Array.isArray(moduleOrders) || moduleOrders.length === 0) {
      return res.status(400).json({ message: 'Format de données invalide' });
    }
    
    // Mettre à jour l'ordre de chaque module
    const updatePromises = moduleOrders.map(item => 
      Module.findByIdAndUpdate(
        item.id,
        { order: item.order, updatedAt: new Date() },
        { session }
      )
    );
    
    await Promise.all(updatePromises);
    
    await session.commitTransaction();
    
    res.status(200).json({ message: 'Ordre des modules mis à jour avec succès' });
  } catch (error) {
    await session.abortTransaction();
    
    res.status(500).json({
      message: 'Erreur lors de la mise à jour de l\'ordre des modules',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};