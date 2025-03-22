const User = require('../models/user.model');
const Exam = require('../models/exam.model');
const logger = require('./logger.service');
const config = require('../config');
const { sendEmail } = require('./email.service');
const socketManager = require('./socket.service');

/**
 * Service de gestion des alertes et notifications
 */
const alertService = {
  /**
   * Notifier les proctors (superviseurs) d'une alerte importante
   */
  notifyProctors: async (session, alert) => {
    try {
      // Récupérer les informations associées
      const exam = await Exam.findById(session.exam);
      const student = await User.findById(session.student);
      
      if (!exam || !student) {
        logger.error('Impossible de notifier les proctors: examen ou étudiant non trouvé', {
          sessionId: session.sessionId,
          examId: session.exam,
          studentId: session.student
        });
        return;
      }
      
      // Récupérer les superviseurs assignés à cet examen
      const proctors = await User.find({
        roles: { $in: ['admin', 'proctor'] },
        _id: { $in: exam.proctors || [] }
      });
      
      if (proctors.length === 0) {
        // Si aucun proctor n'est assigné, notifier les administrateurs
        const admins = await User.find({ roles: 'admin' });
        if (admins.length === 0) {
          logger.warn('Aucun proctor ou administrateur trouvé pour notifier de l\'alerte', {
            sessionId: session.sessionId
          });
          return;
        }
        
        proctors.push(...admins);
      }
      
      // Préparation des données pour la notification
      const alertData = {
        sessionId: session.sessionId,
        examTitle: exam.title,
        examCode: exam.code,
        studentName: `${student.firstName} ${student.lastName}`,
        studentEmail: student.email,
        alertType: alert.type,
        alertMessage: alert.message,
        alertTimestamp: alert.timestamp,
        alertEvidence: alert.evidencePath ? true : false,
        alertSeverity: alert.severity
      };
      
      // Envoyer une notification temps réel via Socket.IO
      this._sendRealTimeAlert(alertData);
      
      // Envoyer des emails aux proctors
      await this._sendEmailAlerts(proctors, alertData);
      
      logger.info(`Notification envoyée à ${proctors.length} proctors`, {
        sessionId: session.sessionId,
        alertType: alert.type
      });
      
      return true;
    } catch (error) {
      logger.error(`Erreur lors de la notification des proctors: ${error.message}`, {
        sessionId: session.sessionId,
        stack: error.stack
      });
      return false;
    }
  },
  
  /**
   * Envoyer une notification en temps réel via Socket.IO
   */
  _sendRealTimeAlert: (alertData) => {
    try {
      // Émettre un événement aux clients connectés à la salle admin:exam:ID
      socketManager.getIO().to(`admin:${alertData.examCode}`).emit('proctor-alert', alertData);
      
      logger.info('Notification temps réel envoyée', {
        examCode: alertData.examCode,
        sessionId: alertData.sessionId
      });
    } catch (error) {
      logger.error(`Erreur lors de l'envoi de la notification temps réel: ${error.message}`);
    }
  },
  
  /**
   * Envoyer des emails d'alerte aux proctors
   */
  _sendEmailAlerts: async (proctors, alertData) => {
    try {
      const emailPromises = proctors.map(proctor => {
        const subject = `Alerte de surveillance - ${alertData.examTitle} (${alertData.examCode})`;
        
        const template = {
          template: 'proctor-alert',
          variables: {
            proctorName: proctor.firstName,
            ...alertData,
            dashboardUrl: `${config.urls.client}/admin/proctoring/session/${alertData.sessionId}`
          }
        };
        
        return sendEmail(proctor.email, subject, template);
      });
      
      await Promise.all(emailPromises);
      
      logger.info(`Emails d'alerte envoyés à ${proctors.length} proctors`, {
        sessionId: alertData.sessionId
      });
    } catch (error) {
      logger.error(`Erreur lors de l'envoi des emails d'alerte: ${error.message}`, {
        stack: error.stack
      });
    }
  },
  
  /**
   * Enregistrer des statistiques d'alerte pour analyse ultérieure
   */
  logAlertStatistics: async (sessionId, alertType, metadata) => {
    try {
      // Cette fonction pourrait être utilisée pour enregistrer des statistiques
      // plus détaillées sur les alertes pour une analyse future
      // (fréquence des types d'alerte, heures les plus propices aux fraudes, etc.)
      logger.info('Statistique d\'alerte enregistrée', {
        sessionId,
        alertType,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Erreur lors de l'enregistrement des statistiques d'alerte: ${error.message}`);
    }
  }
};

module.exports = alertService;