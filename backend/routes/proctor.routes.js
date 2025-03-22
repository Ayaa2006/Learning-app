const express = require('express');
const router = express.Router();
const proctorController = require('../controllers/proctor.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const { proctorValidation } = require('../utils/validations');

/**
 * Routes relatives au système de surveillance des examens
 */

// Routes pour les clients (étudiants)
router.post(
  '/session',
  validationMiddleware(proctorValidation.registerSession),
  proctorController.registerSession
);

router.post(
  '/session/end',
  validationMiddleware(proctorValidation.endSession),
  proctorController.endSession
);

router.post(
  '/alert',
  validationMiddleware(proctorValidation.saveAlert),
  proctorController.saveAlert
);

// Routes pour les administrateurs/proctors (requiert authentification et rôle approprié)
router.get(
  '/sessions/active',
  authMiddleware.isAuthenticated,
  authMiddleware.hasRole(['admin', 'proctor']),
  proctorController.getActiveSessions
);

router.get(
  '/session/:sessionId',
  authMiddleware.isAuthenticated,
  authMiddleware.hasRole(['admin', 'proctor']),
  proctorController.getSessionDetails
);

router.post(
  '/session/:sessionId/terminate',
  authMiddleware.isAuthenticated,
  authMiddleware.hasRole(['admin', 'proctor']),
  validationMiddleware(proctorValidation.terminateSession),
  proctorController.terminateSession
);

router.put(
  '/alert/:alertId/status',
  authMiddleware.isAuthenticated,
  authMiddleware.hasRole(['admin', 'proctor']),
  validationMiddleware(proctorValidation.updateAlertStatus),
  proctorController.updateAlertStatus
);

module.exports = router;