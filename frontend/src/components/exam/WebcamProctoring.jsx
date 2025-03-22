// src/components/exam/WebcamProctoring.jsx
import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import { 
  Box, 
  Typography, 
  Paper, 
  Alert, 
  IconButton,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  Face as FaceIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

const WebcamProctoring = ({ onViolation, onLoaded, tolerance = 3000 }) => {
  const webcamRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [detectionActive, setDetectionActive] = useState(true);
  const [facesDetected, setFacesDetected] = useState(0);
  const [faceVisible, setFaceVisible] = useState(true);
  const [lookingAway, setLookingAway] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [showCamera, setShowCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // Références pour les minuteries et détections
  const timerRef = useRef(null);
  const faceCheckInterval = useRef(null);
  const motionDetectionInterval = useRef(null);
  const previousPixelData = useRef(null);
  
  // Configuration du webcam
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };
  
  // Simuler le chargement de modèles (pour maintenir l'UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onLoaded) onLoaded(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onLoaded]);
  
  // Nettoyage
  useEffect(() => {
    return () => {
      if (faceCheckInterval.current) clearInterval(faceCheckInterval.current);
      if (motionDetectionInterval.current) clearInterval(motionDetectionInterval.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  
  // Gestion de l'initialisation de la caméra
  const handleUserMedia = () => {
    setIsCameraReady(true);
    
    // Simuler une détection de visage basée sur le mouvement
    startMotionDetection();
    
    // Simuler des alertes aléatoires pour démonstration
    startRandomAlerts();
  };
  
  // Ajouter un avertissement
  const addWarning = (message) => {
    const warning = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setWarnings(prev => [warning, ...prev].slice(0, 5)); // Garder seulement les 5 derniers avertissements
  };
  
  // Détection basée sur le mouvement (simulation simple)
  const startMotionDetection = () => {
    if (motionDetectionInterval.current) clearInterval(motionDetectionInterval.current);
    
    motionDetectionInterval.current = setInterval(() => {
      if (!detectionActive || !webcamRef.current || !webcamRef.current.video) {
        return;
      }
      
      try {
        const video = webcamRef.current.video;
        
        // Créer un canvas temporaire pour capturer l'image
        const canvas = document.createElement('canvas');
        canvas.width = 100; // Résolution réduite pour performance
        canvas.height = 75;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 100, 75);
        
        // Obtenir les données de pixels
        const pixelData = ctx.getImageData(0, 0, 100, 75).data;
        
        // Si c'est la première capture, juste sauvegarder
        if (!previousPixelData.current) {
          previousPixelData.current = pixelData;
          return;
        }
        
        // Comparer avec l'image précédente pour détecter le mouvement
        let movementScore = 0;
        let centerAreaActivity = 0;
        let totalPixels = pixelData.length / 4;
        
        for (let i = 0; i < pixelData.length; i += 4) {
          // Calculer la différence entre images
          const diff = Math.abs(pixelData[i] - previousPixelData.current[i]) +
                     Math.abs(pixelData[i+1] - previousPixelData.current[i+1]) +
                     Math.abs(pixelData[i+2] - previousPixelData.current[i+2]);
          
          // Calculer les coordonnées du pixel
          const pixelIndex = i/4;
          const x = pixelIndex % 100;
          const y = Math.floor(pixelIndex / 100);
          
          // Déterminer si le pixel est dans la zone centrale
          const isCenterArea = x > 30 && x < 70 && y > 20 && y < 55;
          
          if (diff > 30) { // Seuil de différence
            movementScore++;
            if (isCenterArea) {
              centerAreaActivity++;
            }
          }
        }
        
        // Mettre à jour les données de référence
        previousPixelData.current = pixelData;
        
        // Logique de détection
        const movementPercentage = (movementScore / totalPixels) * 100;
        const centerActivityPercentage = (centerAreaActivity / (40 * 35)) * 100;
        
        // Simuler la détection de visage
        if (centerActivityPercentage > 0.5) {
          // Activité dans la zone centrale = visage probablement présent
          setFacesDetected(1);
          setFaceVisible(true);
        } else if (movementPercentage < 0.1) {
          // Très peu de mouvement = personne probablement absente
          setFacesDetected(0);
          
          // Déclencher une alerte si c'est un changement
          if (faceVisible) {
            setFaceVisible(false);
            
            timerRef.current = setTimeout(() => {
              if (!faceVisible) {
                addWarning("Aucun mouvement détecté pendant une période prolongée");
                if (onViolation) onViolation({
                  type: 'no_face',
                  timestamp: new Date().toISOString(),
                  details: 'Aucun visage détecté dans le cadre'
                });
              }
            }, tolerance);
          }
        } else if (movementPercentage > 5) {
          // Beaucoup de mouvement = possiblement plusieurs personnes
          if (Math.random() < 0.3) { // Ajouter aléatoirement pour simuler
            setFacesDetected(2);
            addWarning("Mouvements excessifs détectés");
            if (onViolation) onViolation({
              type: 'multiple_faces',
              timestamp: new Date().toISOString(),
              details: 'Mouvements suspects détectés'
            });
          }
        }
        
      } catch (error) {
        console.error("Erreur lors de la détection:", error);
      }
    }, 500);
  };
  
  // Simuler des alertes aléatoires pour la démonstration
  const startRandomAlerts = () => {
    if (faceCheckInterval.current) clearInterval(faceCheckInterval.current);
    
    faceCheckInterval.current = setInterval(() => {
      if (!detectionActive) return;
      
      // Simuler des événements de regarder ailleurs
      if (Math.random() < 0.1) {
        const isLookingAwaySim = !lookingAway;
        setLookingAway(isLookingAwaySim);
        
        if (isLookingAwaySim) {
          setTimeout(() => {
            addWarning("L'utilisateur semble regarder ailleurs");
            if (onViolation) onViolation({
              type: 'looking_away',
              timestamp: new Date().toISOString(),
              details: 'Détection de regard détourné'
            });
          }, 2000);
        }
      }
    }, 10000);
  };
  
  // Gérer la visibilité de la caméra
  const toggleCameraVisibility = () => {
    setShowCamera(!showCamera);
  };
  
  // Désactiver/activer la détection
  const toggleDetection = () => {
    setDetectionActive(!detectionActive);
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          Surveillance d'examen
        </Typography>
        <Box>
          <IconButton onClick={toggleCameraVisibility} color="primary" title={showCamera ? "Masquer la caméra" : "Afficher la caméra"}>
            {showCamera ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
          <IconButton onClick={toggleDetection} color={detectionActive ? "success" : "error"} title={detectionActive ? "Désactiver la détection" : "Activer la détection"}>
            <CameraIcon />
          </IconButton>
        </Box>
      </Box>
      
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Initialisation du système de surveillance...
          </Typography>
        </Box>
      )}
      
      {!isLoading && (
        <>
          {showCamera && (
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              height: 'auto', 
              maxWidth: '400px', 
              margin: '0 auto',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 1,
              overflow: 'hidden'
            }}>
              <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                mirrored={true}
                style={{ 
                  width: '100%', 
                  height: 'auto'
                }}
              />
              
              {isCameraReady && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10, 
                  display: 'flex', 
                  gap: 1 
                }}>
                  <Chip 
                    icon={<FaceIcon />} 
                    label={`Visages: ${facesDetected}`} 
                    color={facesDetected === 1 ? "success" : facesDetected === 0 ? "error" : "warning"}
                    size="small"
                    variant="filled"
                  />
                </Box>
              )}
            </Box>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              État de la surveillance:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label="Caméra" 
                color={isCameraReady ? "success" : "error"} 
                variant="outlined" 
                size="small" 
              />
              <Chip 
                label="Détection" 
                color={detectionActive ? "success" : "error"} 
                variant="outlined" 
                size="small" 
              />
              <Chip 
                label="Visage visible" 
                color={faceVisible ? "success" : "error"} 
                variant="outlined" 
                size="small" 
              />
              <Chip 
                label="Direction du regard" 
                color={lookingAway ? "warning" : "success"} 
                variant="outlined" 
                size="small" 
              />
            </Box>
          </Box>
          
          {warnings.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Alertes récentes:
              </Typography>
              {warnings.map((warning) => (
                <Alert 
                  key={warning.id} 
                  severity="warning" 
                  sx={{ mb: 1 }}
                  variant="outlined"
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">{warning.message}</Typography>
                    <Typography variant="caption" color="text.secondary">{warning.timestamp}</Typography>
                  </Box>
                </Alert>
              ))}
            </Box>
          )}
        </>
      )}
    </Paper>
  );
};

export default WebcamProctoring;