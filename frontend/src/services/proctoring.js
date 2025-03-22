import * as faceapi from 'face-api.js';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import * as tf from '@tensorflow/tfjs';
import { v4 as uuidv4 } from 'uuid';
import api from './api';

// Configuration du système de surveillance
const CONFIG = {
  captureInterval: 2000,         // Intervalle de capture en ms
  warningThreshold: 3,           // Nombre d'avertissements avant notification
  detectionConfidence: 0.7,      // Seuil de confiance pour les détections
  faceDetectionInterval: 1000,   // Intervalle pour la détection du visage
  objectDetectionInterval: 5000, // Intervalle pour la détection d'objets
  forbiddenObjects: ['cell phone', 'book', 'laptop', 'person']
};

class ProctoringService {
  constructor() {
    this.stream = null;
    this.videoRef = null;
    this.canvas = document.createElement('canvas');
    this.sessionId = uuidv4();
    this.warningCount = 0;
    this.lastFacePosition = null;
    this.modelsLoaded = false;
    this.detectionActive = false;
    this.lastWarningTime = 0;
    this.faceDetectionInterval = null;
    this.objectDetectionInterval = null;
    this.cocoSSDModel = null;
    this.callbacks = {
      onWarning: null,
      onStatusChange: null,
      onCriticalWarning: null,
      onModelLoadProgress: null
    };
  }

  // Enregistrer les callbacks
  registerCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Initialiser le système de surveillance
  async initialize(videoRef, examId, studentId) {
    try {
      this.videoRef = videoRef;

      // Configurer le canvas pour l'analyse
      this.canvas.width = 640;
      this.canvas.height = 480;

      // Demander l'accès à la caméra
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });

      // S'assurer que la vidéo est chargée
      await new Promise(resolve => {
        const video = videoRef.current;
        video.srcObject = this.stream;
        video.onloadedmetadata = () => resolve();
      });

      // Charger les modèles
      await this.loadModels();

      // Enregistrer la session
      await this.registerSession(examId, studentId);

      // Démarrer la détection
      this.startDetection();

      return true;
    } catch (error) {
      console.error('Erreur d\'initialisation de la surveillance:', error);
      this._updateStatus('error', 'Erreur d\'accès à la caméra');
      
      // Notifier le serveur de l'échec
      await this.sendAlert({
        type: 'SYSTEM_ERROR',
        message: 'Échec d\'initialisation de la caméra',
        details: error.message
      });
      
      return false;
    }
  }

  // Charger les modèles nécessaires
  async loadModels() {
    try {
      this._updateStatus('warning', 'Chargement des modèles...');
      
      // Charger les modèles de face-api.js
      const MODEL_URL = '/models';
      
      // Signaler les progrès de chargement
      this._updateModelLoadProgress(10);
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.load(MODEL_URL).then(() => this._updateModelLoadProgress(30)),
        faceapi.nets.faceLandmark68Net.load(MODEL_URL).then(() => this._updateModelLoadProgress(50)),
        faceapi.nets.faceRecognitionNet.load(MODEL_URL).then(() => this._updateModelLoadProgress(70))
      ]);
      
      // Charger COCO-SSD pour la détection d'objets
      await tf.ready();
      this._updateModelLoadProgress(80);
      
      this.cocoSSDModel = await cocoSsd.load();
      this._updateModelLoadProgress(100);
      
      this.modelsLoaded = true;
      this._updateStatus('success', 'Modèles chargés avec succès');
      
      return true;
    } catch (error) {
      console.error('Erreur de chargement des modèles:', error);
      this._updateStatus('error', 'Erreur de chargement des modèles');
      
      await this.sendAlert({
        type: 'MODEL_LOAD_ERROR',
        message: 'Échec du chargement des modèles d\'IA',
        details: error.message
      });
      
      return false;
    }
  }

  // Démarrer les détections périodiques
  startDetection() {
    if (!this.modelsLoaded) {
      console.error('Impossible de démarrer la détection. Modèles non chargés.');
      return false;
    }

    this.detectionActive = true;
    
    // Détection de visage plus fréquente
    this.faceDetectionInterval = setInterval(
      () => this.detectFace(), 
      CONFIG.faceDetectionInterval
    );
    
    // Détection d'objets moins fréquente
    this.objectDetectionInterval = setInterval(
      () => this.detectObjects(), 
      CONFIG.objectDetectionInterval
    );
    
    this._updateStatus('success', 'Surveillance active');
    return true;
  }

  // Arrêter les détections
  stopDetection() {
    clearInterval(this.faceDetectionInterval);
    clearInterval(this.objectDetectionInterval);
    this.detectionActive = false;
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    this._updateStatus('info', 'Surveillance arrêtée');
  }

  // Détecter la position et présence du visage
  async detectFace() {
    if (!this.detectionActive || !this.videoRef || !this.modelsLoaded) return;
    
    try {
      const video = this.videoRef.current;
      
      // Dessiner l'image actuelle sur le canvas
      const context = this.canvas.getContext('2d');
      context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
      
      // Détecter les visages
      const detections = await faceapi.detectAllFaces(
        video, 
        new faceapi.TinyFaceDetectorOptions({ 
          inputSize: 320, 
          scoreThreshold: CONFIG.detectionConfidence 
        })
      ).withFaceLandmarks().withFaceDescriptors();
      
      // Vérifier si aucun visage n'est détecté
      if (detections.length === 0) {
        this.handleViolation('NO_FACE_DETECTED', 'Aucun visage détecté dans le champ de la caméra');
        return;
      }
      
      // Vérifier si plus d'un visage est détecté
      if (detections.length > 1) {
        this.handleViolation('MULTIPLE_FACES', 'Plusieurs personnes détectées dans le champ de la caméra');
        return;
      }
      
      // Analyser la position du visage
      const detection = detections[0];
      const faceBox = detection.detection.box;
      
      // Vérifier si le visage est centré
      const videoWidth = video.videoWidth || 640;
      const videoHeight = video.videoHeight || 480;
      const videoCenter = { x: videoWidth / 2, y: videoHeight / 2 };
      const faceCenter = { 
        x: faceBox.x + faceBox.width / 2, 
        y: faceBox.y + faceBox.height / 2 
      };
      
      const distanceFromCenter = Math.sqrt(
        Math.pow(faceCenter.x - videoCenter.x, 2) + 
        Math.pow(faceCenter.y - videoCenter.y, 2)
      );
      
      // Si le visage est trop loin du centre
      if (distanceFromCenter > videoWidth * 0.25) {
        this.handleViolation('FACE_NOT_CENTERED', 'Votre visage n\'est pas bien centré');
        return;
      }
      
      // Vérification du regard
      const leftEye = detection.landmarks.getLeftEye();
      const rightEye = detection.landmarks.getRightEye();
      
      const eyeDirectionOK = this._checkEyeDirection(leftEye, rightEye);
      
      if (!eyeDirectionOK) {
        this.handleViolation('SUSPICIOUS_GAZE', 'Direction du regard suspecte');
        return;
      }
      
      // Si tout est OK, réduire progressivement le compteur d'avertissement
      if (this.warningCount > 0) {
        this.warningCount = Math.max(0, this.warningCount - 0.5);
        
        if (this.warningCount === 0) {
          this._updateStatus('success', 'Surveillance active');
        }
      }
      
      this.lastFacePosition = faceCenter;
      
    } catch (error) {
      console.error('Erreur de détection du visage:', error);
    }
  }

  // Détection d'objets interdits
  async detectObjects() {
    if (!this.detectionActive || !this.videoRef || !this.cocoSSDModel) return;
    
    try {
      const video = this.videoRef.current;
      
      // Utiliser COCO-SSD pour détecter les objets
      const predictions = await this.cocoSSDModel.detect(video);
      
      // Filtrer les objets interdits
      const forbiddenItems = predictions.filter(prediction => 
        CONFIG.forbiddenObjects.includes(prediction.class) && 
        prediction.score > CONFIG.detectionConfidence
      );
      
      if (forbiddenItems.length > 0) {
        // Prendre une capture comme preuve
        const evidence = this._captureEvidence();
        
        // Pour chaque objet interdit
        forbiddenItems.forEach(item => {
          this.handleViolation(
            'FORBIDDEN_OBJECT', 
            `Objet interdit détecté: ${item.class}`, 
            evidence,
            { objectType: item.class, confidence: item.score }
          );
        });
      }
      
    } catch (error) {
      console.error('Erreur de détection d\'objets:', error);
    }
  }

  // Gérer les violations détectées
  async handleViolation(type, message, evidence = null, metadata = {}) {
    // Éviter de spammer l'utilisateur avec des alertes trop fréquentes
    const now = Date.now();
    if (now - this.lastWarningTime < 3000) {
      return;
    }
    
    // Incrémenter le compteur d'avertissements
    this.warningCount++;
    this.lastWarningTime = now;
    
    // Capturer une image comme preuve si non fournie
    if (!evidence) {
      evidence = this._captureEvidence();
    }
    
    // Notifier via les callbacks
    if (this.callbacks.onWarning) {
      this.callbacks.onWarning(message);
    }
    
    // Mettre à jour le statut
    if (this.warningCount >= CONFIG.warningThreshold) {
      this._updateStatus('error', 'Comportement suspect détecté');
      
      // Notifier pour l'affichage du modal
      if (this.callbacks.onCriticalWarning) {
        this.callbacks.onCriticalWarning(message, evidence);
      }
      
      // Envoyer une alerte au serveur
      await this.sendAlert({
        type,
        message,
        evidence,
        sessionId: this.sessionId,
        timestamp: now,
        warningCount: this.warningCount,
        metadata
      });
    } else {
      this._updateStatus('warning', 'Avertissement: ' + message);
    }
  }

  // Capturer une image comme preuve
  _captureEvidence() {
    const video = this.videoRef.current;
    const context = this.canvas.getContext('2d');
    context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
    return this.canvas.toDataURL('image/jpeg', 0.7);
  }

  // Vérification simplifiée de la direction du regard
  _checkEyeDirection(leftEye, rightEye) {
    // Calculer les centres des yeux
    const leftEyeCenter = {
      x: leftEye.reduce((sum, pt) => sum + pt.x, 0) / leftEye.length,
      y: leftEye.reduce((sum, pt) => sum + pt.y, 0) / leftEye.length
    };
    
    const rightEyeCenter = {
      x: rightEye.reduce((sum, pt) => sum + pt.x, 0) / rightEye.length,
      y: rightEye.reduce((sum, pt) => sum + pt.y, 0) / rightEye.length
    };
    
    // Vérifier si les yeux sont approximativement au même niveau
    const yDiff = Math.abs(leftEyeCenter.y - rightEyeCenter.y);
    const xDist = Math.abs(leftEyeCenter.x - rightEyeCenter.x);
    
    // Si la différence de hauteur est trop grande par rapport à la distance horizontale
    // cela peut indiquer que la personne regarde ailleurs
    return yDiff < (xDist * 0.2);
  }

  // Mettre à jour le statut
  _updateStatus(status, message) {
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange(status, message);
    }
  }

  // Mettre à jour le progrès de chargement des modèles
  _updateModelLoadProgress(progress) {
    if (this.callbacks.onModelLoadProgress) {
      this.callbacks.onModelLoadProgress(progress);
    }
  }

  // Enregistrer une session
  async registerSession(examId, studentId) {
    try {
      await api.post('/proctor/session', {
        sessionId: this.sessionId,
        examId,
        studentId,
        startTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`
      });
      
      return true;
    } catch (error) {
      console.error('Erreur d\'enregistrement de session:', error);
      return false;
    }
  }

  // Terminer une session
  async endSession() {
    try {
      await api.post('/proctor/session/end', {
        sessionId: this.sessionId,
        endTime: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Erreur de fin de session:', error);
      return false;
    }
  }

  // Envoyer une alerte au serveur
  async sendAlert(alertData) {
    try {
      await api.post('/proctor/alert', alertData);
      return true;
    } catch (error) {
      console.error('Erreur d\'envoi d\'alerte:', error);
      return false;
    }
  }
}

export default new ProctoringService();