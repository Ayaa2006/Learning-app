const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Session = require('../models/session.model');
const Alert = require('../models/alert.model');
const User = require('../models/user.model');
const Exam = require('../models/exam.model');
const config = require('../config');
const logger = require('../services/logger.service');
const alertService = require('../services/alert.service');

/**
 * Enregistrer une nouvelle session de surveillance
 */
exports.registerSession = async (req, res) => {
  try {
    const {
      sessionId,
      examId,
      studentId,
      startTime,
      userAgent,
      screenResolution
    } = req.body;

    // Vérifier que l'examen et l'étudiant existent
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Examen non trouvé' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    // Vérifier s'il existe déjà une session active pour cet étudiant et cet examen
    const existingSession = await Session.findOne({
      exam: examId,
      student: studentId,
      status: 'active'
    });

    if (existingSession) {
      // Mettre à jour la session existante
      existingSession.sessionId = sessionId;
      existingSession.startTime = startTime || new Date();
      existingSession.environment.userAgent = userAgent;
      existingSession.environment.screenResolution = screenResolution;
      existingSession.environment.ipAddress = req.ip;

      await existingSession.save();

      return res.status(200).json({
        message: 'Session mise à jour avec succès',
        session: existingSession
      });
    }

    // Créer une nouvelle session
    const session = new Session({
      sessionId,
      exam: examId,
      student: studentId,
      startTime: startTime || new Date(),
      environment: {
        userAgent,
        screenResolution,
        ipAddress: req.ip,
        browser: extractBrowserInfo(userAgent),
        os: extractOSInfo(userAgent),
        timezone: req.body.timezone || 'Unknown'
      }
    });

    await session.save();

    logger.info(`Nouvelle session de surveillance enregistrée: ${sessionId}`, {
      examId,
      studentId
    });

    return res.status(201).json({
      message: 'Session enregistrée avec succès',
      session
    });
  } catch (error) {
    logger.error(`Erreur lors de l'enregistrement de la session: ${error.message}`, {
      stack: error.stack
    });
    
    return res.status(500).json({
      message: 'Erreur lors de l\'enregistrement de la session',
      error: error.message
    });
  }
};

/**
 * Terminer une session de surveillance
 */
exports.endSession = async (req, res) => {
  try {
    const { sessionId, endTime } = req.body;

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    // Terminer la session
    session.endTime = endTime || new Date();
    session.status = 'completed';
    
    await session.save();

    // Récupérer toutes les alertes pour cette session
    const alerts = await Alert.find({ sessionId });
    
    // Mettre à jour les statistiques
    await session.updateStats(alerts);

    logger.info(`Session de surveillance terminée: ${sessionId}`, {
      examId: session.exam,
      studentId: session.student,
      duration: session.duration
    });

    return res.status(200).json({
      message: 'Session terminée avec succès',
      session
    });
  } catch (error) {
    logger.error(`Erreur lors de la fin de la session: ${error.message}`, {
      stack: error.stack
    });
    
    return res.status(500).json({
      message: 'Erreur lors de la fin de la session',
      error: error.message
    });
  }
};

/**
 * Enregistrer une alerte de surveillance
 */
exports.saveAlert = async (req, res) => {
  try {
    const {
      type,
      message,
      evidence,
      sessionId,
      timestamp,
      warningCount,
      metadata
    } = req.body;

    // Vérifier que la session existe
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    // Sauvegarder l'image de preuve si présente
    let evidencePath = null;
    if (evidence) {
      // S'assurer que le répertoire de captures existe
      const captureDir = path.join(config.proctoring.captureSaveDirectory, sessionId);
      if (!fs.existsSync(captureDir)) {
        fs.mkdirSync(captureDir, { recursive: true });
      }

      // Générer un nom de fichier unique
      const fileName = `${Date.now()}_${uuidv4().slice(0, 8)}.jpg`;
      evidencePath = path.join(captureDir, fileName);

      // Sauvegarder l'image
      const base64Data = evidence.replace(/^data:image\/jpeg;base64,/, '');
      fs.writeFileSync(evidencePath, base64Data, 'base64');
    }

    // Créer l'alerte
    const alert = new Alert({
      sessionId,
      type,
      message,
      timestamp: timestamp || new Date(),
      evidence: evidence ? true : false,
      evidencePath,
      metadata
    });

    await alert.save();

    // Mettre à jour les statistiques de la session
    session.stats.totalAlerts = (session.stats.totalAlerts || 0) + 1;
    
    // Incrémenter le compteur pour ce type d'alerte
    const alertsByType = session.stats.alertsByType || new Map();
    const currentCount = alertsByType.get(type) || 0;
    alertsByType.set(type, currentCount + 1);
    session.stats.alertsByType = alertsByType;
    
    await session.save();

    // Envoyer une notification aux administrateurs si le seuil est atteint
    if (warningCount >= config.proctoring.alertThreshold) {
      await alertService.notifyProctors(session, alert);
    }

    logger.info(`Alerte de surveillance enregistrée: ${type}`, {
      sessionId,
      message
    });

    return res.status(201).json({
      message: 'Alerte enregistrée avec succès',
      alert
    });
  } catch (error) {
    logger.error(`Erreur lors de l'enregistrement de l'alerte: ${error.message}`, {
      stack: error.stack
    });
    
    return res.status(500).json({
      message: 'Erreur lors de l\'enregistrement de l\'alerte',
      error: error.message
    });
  }
};

/**
 * Récupérer les sessions de surveillance actives
 */
exports.getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ status: 'active' })
      .populate('exam', 'title code')
      .populate('student', 'firstName lastName email')
      .sort({ startTime: -1 });

    return res.status(200).json({
      count: sessions.length,
      sessions
    });
  } catch (error) {
    logger.error(`Erreur lors de la récupération des sessions actives: ${error.message}`, {
      stack: error.stack
    });
    
    return res.status(500).json({
      message: 'Erreur lors de la récupération des sessions actives',
      error: error.message
    });
  }
};

/**
 * Récupérer les détails d'une session et ses alertes
 */
exports.getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({ sessionId })
      .populate('exam', 'title code duration')
      .populate('student', 'firstName lastName email');

    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    const alerts = await Alert.find({ sessionId })
      .sort({ timestamp: 1 });

    return res.status(200).json({
      session,
      alerts
    });
  } catch (error) {
    logger.error(`Erreur lors de la récupération des détails de la session: ${error.message}`, {
      stack: error.stack
    });
    
    return res.status(500).json({
      message: 'Erreur lors de la récupération des détails de la session',
      error: error.message
    });
  }
};

/**
 * Terminer une session de surveillance manuellement (par l'administrateur)
 */
exports.terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { reason } = req.body;

    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ message: 'Session non trouvée' });
    }

    // Terminer la session
    session.endTime = new Date();
    session.status = 'terminated';
    session.notes = reason || 'Session terminée par l\'administrateur';
    
    await session.save();

    logger.info(`Session de surveillance terminée manuellement: ${sessionId}`, {
      adminId: req.user.id,
      reason
    });

    return res.status(200).json({
      message: 'Session terminée avec succès',
      session
    });
  } catch (error) {
    logger.error(`Erreur lors de la terminaison de la session: ${error.message}`, {
      stack: error.stack
    });
    
    return res.status(500).json({
      message: 'Erreur lors de la terminaison de la session',
      error: error.message
    });
  }
};

/**
 * Mettre à jour le statut de révision d'une alerte
 */
exports.updateAlertStatus = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, notes } = req.body;

    const alert = await Alert.findById(alertId);
    if (!alert) {
      return res.status(404).json({ message: 'Alerte non trouvée' });
    }

    // Mettre à jour le statut
    switch (status) {
      case 'dismissed':
        await alert.dismiss(req.user.id, notes);
        break;
      case 'flagged':
        await alert.flag(req.user.id, notes);
        break;
      case 'reviewed':
        await alert.review(req.user.id, notes);
        break;
      default:
        return res.status(400).json({ message: 'Statut invalide' });
    }

    logger.info(`Statut de l'alerte mis à jour: ${alertId} -> ${status}`, {
      adminId: req.user.id
    });

    return res.status(200).json({
      message: 'Statut de l\'alerte mis à jour avec succès',
      alert
    });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour du statut de l'alerte: ${error.message}`, {
      stack: error.stack
    });
    
    return res.status(500).json({
      message: 'Erreur lors de la mise à jour du statut de l\'alerte',
      error: error.message
    });
  }
};

// Fonctions utilitaires

/**
 * Extraire les informations du navigateur à partir de l'user agent
 */
function extractBrowserInfo(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Firefox')) {
    return 'Firefox';
  } else if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
    return 'Chrome';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    return 'Safari';
  } else if (userAgent.includes('Edg')) {
    return 'Edge';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident/')) {
    return 'Internet Explorer';
  } else {
    return 'Unknown';
  }
}

/**
 * Extraire les informations du système d'exploitation à partir de l'user agent
 */
function extractOSInfo(userAgent) {
  if (!userAgent) return 'Unknown';
  
  if (userAgent.includes('Windows')) {
    return 'Windows';
  } else if (userAgent.includes('Mac OS')) {
    return 'MacOS';
  } else if (userAgent.includes('Linux')) {
    return 'Linux';
  } else if (userAgent.includes('Android')) {
    return 'Android';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    return 'iOS';
  } else {
    return 'Unknown';
  }
}