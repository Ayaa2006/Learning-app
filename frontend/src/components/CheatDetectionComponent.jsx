import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { 
  Box, 
  Typography, 
  Paper, 
  Alert, 
  Chip,
  CircularProgress,
  IconButton,
  Badge,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

/**
 * Composant de détection de triche pour les examens en ligne
 */
function CheatDetectionComponent({ 
  examId = 'exam-default', 
  onCheatDetected, 
  tolerance = {},
  maxCheats = 3, // Nombre maximal d'infractions autorisées
  initialCheatCount = 0 // Compteur initial d'infractions
}) {
  const webcamRef = useRef(null);
  const detectionInterval = useRef(null);
  const windowFocusTimeout = useRef(null);
  const noFaceTimeout = useRef(null);
  const multipleFacesTimeout = useRef(null);
  const movementTimeout = useRef(null);
  const eyesCoveredTimeout = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const debugCanvasRef = useRef(null);
  const previousImageData = useRef(null);

  const [webcamReady, setWebcamReady] = useState(false);
  const [cheatDetected, setCheatDetected] = useState(false);
  const [webcamError, setWebcamError] = useState(false);
  const [cheatCount, setCheatCount] = useState(initialCheatCount); // Compteur de triches
  const [detectionStats, setDetectionStats] = useState({
    facesDetected: 0,
    faceVisible: false,
    movementDetected: false,
    eyesCovered: false
  });
  const [showDebug, setShowDebug] = useState(false);
  const [recentCheatType, setRecentCheatType] = useState(null); // Pour éviter les déclenchements multiples du même type
  const [expulsionTriggered, setExpulsionTriggered] = useState(false); // Pour éviter les expulsions multiples

  // Variables pour suivre les changements de fenêtre
  const windowChangeCount = useRef(0);
  const lastActiveTime = useRef(Date.now());
  const lastFacePosition = useRef({ x: 0, y: 0 });
  const movementHistory = useRef([]);
  
  // On garde une référence au compteur de triches pour pouvoir y accéder dans les fonctions de timeout
  const cheatCountRef = useRef(initialCheatCount);
  useEffect(() => {
    cheatCountRef.current = cheatCount;
  }, [cheatCount]);

  // Configuration des délais de tolérance
  const toleranceSettings = {
    windowChange: tolerance.windowChange || 2000,
    multiplePersons: tolerance.multiplePersons || 1000,
    noFace: tolerance.noFace || 4000,
    rapidMovement: tolerance.rapidMovement || 3000,
    eyesCovered: tolerance.eyesCovered || 3000
  };
  
  // Ajouter un délai entre les alertes du même type
  const lastCheatTime = useRef({
    window_change: 0,
    multiple_window_changes: 0,
    multiple_faces: 0,
    no_face: 0,
    rapid_movement: 0,
    eyes_covered: 0
  });
  const SAME_CHEAT_COOLDOWN = 8000; // 8 secondes entre les alertes du même type

  // Délai avant que le compteur de triches puisse à nouveau être incrémenté
  const cheatCooldown = 3000; // 3 secondes entre chaque incrémentation du compteur
  const lastCheatCountIncrement = useRef(0);

  // Fonction pour calculer la différence entre deux images (détection de mouvement)
  const detectMovement = (currentImageData, previousImageData) => {
    if (!previousImageData) return 0;
    
    const currentData = currentImageData.data;
    const prevData = previousImageData.data;
    let diffCount = 0;
    const threshold = 30; // Seuil de différence pour considérer un pixel comme différent
    
    // Échantillonner 1 pixel sur 10 pour la performance
    for (let i = 0; i < currentData.length; i += 40) {
      const diff = Math.abs(currentData[i] - prevData[i]) + 
                   Math.abs(currentData[i+1] - prevData[i+1]) + 
                   Math.abs(currentData[i+2] - prevData[i+2]);
      
      if (diff > threshold) {
        diffCount++;
      }
    }
    
    // Normaliser le score de mouvement (0-100)
    return Math.min(100, (diffCount / (currentData.length / 40)) * 100);
  };

  // Fonction pour détecter les yeux couverts (zone sombre au niveau des yeux)
  const detectEyesCovered = (faceRegion, imageData) => {
    if (!faceRegion) return false;
    
    // Définir approximativement la zone des yeux par rapport au visage
    const eyeRegionTop = faceRegion.y - 20;
    const eyeRegionHeight = 40;
    const eyeRegionLeft = faceRegion.x - 30;
    const eyeRegionWidth = 60;
    
    // Si la région des yeux est hors du cadre, retourner false
    if (eyeRegionTop < 0 || eyeRegionLeft < 0 || 
        eyeRegionTop + eyeRegionHeight >= imageData.height || 
        eyeRegionLeft + eyeRegionWidth >= imageData.width) {
      return false;
    }
    
    // Compter les pixels sombres dans la région des yeux
    const data = imageData.data;
    let darkPixelCount = 0;
    const darkThreshold = 80; // Seuil pour considérer un pixel comme sombre
    
    for (let y = eyeRegionTop; y < eyeRegionTop + eyeRegionHeight; y++) {
      for (let x = eyeRegionLeft; x < eyeRegionLeft + eyeRegionWidth; x++) {
        const idx = (y * imageData.width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const brightness = (r + g + b) / 3;
        
        if (brightness < darkThreshold) {
          darkPixelCount++;
        }
      }
    }
    
    // Si plus de 50% des pixels sont sombres, considérer que les yeux sont couverts
    const totalPixels = eyeRegionWidth * eyeRegionHeight;
    return (darkPixelCount / totalPixels) > 0.5;
  };

  // Fonction pour détecter les visages basée sur la couleur de peau
  const detectFaces = () => {
    if (!webcamRef.current || !webcamRef.current.video || !webcamRef.current.video.readyState === 4) {
      return;
    }
    
    try {
      const video = webcamRef.current.video;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      
      // Configurer le canvas à une taille plus proche de celle de la webcam
      canvas.width = 320;
      canvas.height = 240;
      
      // Dessiner l'image de la webcam sur le canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Obtenir les données de l'image
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Détecter le mouvement en comparant avec l'image précédente
      const movementScore = previousImageData.current ? 
        detectMovement(imageData, previousImageData.current) : 0;
      
      // Ajouter le score à l'historique et garder les 10 derniers scores
      movementHistory.current.push(movementScore);
      if (movementHistory.current.length > 10) {
        movementHistory.current.shift();
      }
      
      // Calculer le score moyen de mouvement récent
      const avgMovementScore = movementHistory.current.reduce((sum, score) => sum + score, 0) / 
                              movementHistory.current.length;
      
      // Stocker l'image actuelle pour la prochaine comparaison
      previousImageData.current = imageData;
      
      // Compter les pixels de couleur de peau
      let skinPixelCount = 0;
      let skinRegions = [];
      
      // Parcourir l'image par blocs pour la performance
      const step = 4;
      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const idx = (y * canvas.width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          
          // Détection de couleur de peau plus stricte pour réduire les faux positifs
          if (
            r > 95 && g > 40 && b > 20 && // Valeurs minimales plus élevées
            r > g && g > b && 
            r - g > 15 && r - b > 15 &&   // Différences plus strictes
            (r + g + b) > 150 &&          // Vérification de luminosité plus élevée
            r < 240 && g < 200 && b < 180 // Limites supérieures pour éviter les zones trop claires
          ) {
            skinPixelCount++;
            
            // Ajouter au tableau des régions de peau
            const found = skinRegions.some(region => {
              const distance = Math.sqrt(Math.pow(region.x - x, 2) + Math.pow(region.y - y, 2));
              if (distance < 30) {  // Distance réduite pour mieux regrouper
                region.count++;
                return true;
              }
              return false;
            });
            
            if (!found) {
              skinRegions.push({ x, y, count: 1 });
            }
          }
        }
      }
      
      // Dessiner l'analyse sur le canvas de débogage si activé
      if (showDebug && debugCanvasRef.current) {
        const debugCtx = debugCanvasRef.current.getContext('2d');
        debugCtx.clearRect(0, 0, debugCanvasRef.current.width, debugCanvasRef.current.height);
        
        // Dessiner l'image d'origine
        debugCtx.drawImage(canvas, 0, 0);
        
        // Marquer les pixels de peau
        skinRegions.forEach(region => {
          debugCtx.beginPath();
          debugCtx.arc(region.x, region.y, 2, 0, 2 * Math.PI);
          debugCtx.fillStyle = 'rgba(0, 255, 0, 0.5)';
          debugCtx.fill();
        });
        
        // Afficher le score de mouvement
        debugCtx.font = '14px Arial';
        debugCtx.fillStyle = 'white';
        debugCtx.fillRect(10, 50, 150, 20);
        debugCtx.fillStyle = 'black';
        debugCtx.fillText(`Mouvement: ${avgMovementScore.toFixed(1)}`, 20, 65);
      }
      
      // Filtrer les régions trop petites
      const significantRegions = skinRegions.filter(region => region.count > 3);
      
      // Fusionner les régions proches avec un algorithme simplifié
      let mergedRegions = [];
      let processed = new Array(significantRegions.length).fill(false);
      
      for (let i = 0; i < significantRegions.length; i++) {
        if (processed[i]) continue;
        
        processed[i] = true;
        let mergedRegion = { ...significantRegions[i] };
        
        for (let j = 0; j < significantRegions.length; j++) {
          if (processed[j] || i === j) continue;
          
          const distance = Math.sqrt(
            Math.pow(significantRegions[i].x - significantRegions[j].x, 2) +
            Math.pow(significantRegions[i].y - significantRegions[j].y, 2)
          );
          
          if (distance < 60) {  // Distance augmentée pour mieux connecter les parties du visage
            processed[j] = true;
            mergedRegion.count += significantRegions[j].count;
          }
        }
        
        mergedRegions.push(mergedRegion);
      }
      
      // Estimer le nombre de visages (les régions assez grandes)
      // Seuil augmenté pour réduire les faux positifs
      const faces = mergedRegions.filter(region => region.count > 15);
      
      // Filtre supplémentaire: vérifier la distance entre les régions pour détecter des faux visages
      const significantFaces = [];
      for (let i = 0; i < faces.length; i++) {
        let isSignificant = true;
        
        // Vérifier si cette région est assez éloignée des régions déjà considérées comme visages
        for (let j = 0; j < significantFaces.length; j++) {
          const distance = Math.sqrt(
            Math.pow(faces[i].x - significantFaces[j].x, 2) +
            Math.pow(faces[i].y - significantFaces[j].y, 2)
          );
          
          // Si trop proche d'un visage existant, c'est probablement une partie du même visage
          if (distance < 100) {
            isSignificant = false;
            break;
          }
        }
        
        if (isSignificant) {
          significantFaces.push(faces[i]);
        }
      }
      
      // Limitons à un maximum de 2 pour être plus conservatif
      const faceCount = Math.min(significantFaces.length, 2);
      
      // Dessiner les régions de visage sur le canvas de débogage
      if (showDebug && debugCanvasRef.current) {
        const debugCtx = debugCanvasRef.current.getContext('2d');
        significantFaces.forEach(face => {
          debugCtx.beginPath();
          debugCtx.arc(face.x, face.y, 20, 0, 2 * Math.PI);
          debugCtx.strokeStyle = 'red';
          debugCtx.lineWidth = 2;
          debugCtx.stroke();
        });
        
        // Afficher le nombre de visages détectés
        debugCtx.font = '16px Arial';
        debugCtx.fillStyle = 'white';
        debugCtx.fillRect(10, 10, 150, 30);
        debugCtx.fillStyle = 'black';
        debugCtx.fillText(`Visages: ${faceCount}`, 20, 30);
      }
      
      // Détecter si les yeux sont couverts (pour le premier visage détecté)
      const eyesCovered = significantFaces.length > 0 ? 
        detectEyesCovered(significantFaces[0], imageData) : false;
      
      // Mettre à jour les statistiques
      setDetectionStats({
        facesDetected: faceCount,
        faceVisible: faceCount > 0,
        movementDetected: avgMovementScore > 40, // Seuil de mouvement rapide
        eyesCovered: eyesCovered
      });
      
      // Si déjà expulsé, ne pas continuer avec la détection
      if (expulsionTriggered) return;
      
      // Vérification des cas de triche
      const now = Date.now();
      
      // 1. Plusieurs visages
      if (faceCount > 1) {
        if (!multipleFacesTimeout.current) {
          multipleFacesTimeout.current = setTimeout(() => {
            if (detectionStats.facesDetected > 1 && !expulsionTriggered) {
              const cheatType = 'multiple_faces';
              const lastTime = lastCheatTime.current[cheatType];
              
              // Vérifier si assez de temps s'est écoulé depuis la dernière alerte de ce type
              if (now - lastTime > SAME_CHEAT_COOLDOWN) {
                lastCheatTime.current[cheatType] = now;
                handleCheat(cheatType, `${faceCount} visages détectés dans le cadre`);
              }
            }
            multipleFacesTimeout.current = null;
          }, toleranceSettings.multiplePersons);
        }
      } else if (multipleFacesTimeout.current) {
        clearTimeout(multipleFacesTimeout.current);
        multipleFacesTimeout.current = null;
      }
      
      // 2. Aucun visage
      if (faceCount === 0) {
        if (!noFaceTimeout.current) {
          noFaceTimeout.current = setTimeout(() => {
            if (detectionStats.facesDetected === 0 && !expulsionTriggered) {
              const cheatType = 'no_face';
              const lastTime = lastCheatTime.current[cheatType];
              
              // Vérifier si assez de temps s'est écoulé depuis la dernière alerte de ce type
              if (now - lastTime > SAME_CHEAT_COOLDOWN) {
                lastCheatTime.current[cheatType] = now;
                handleCheat(cheatType, 'Aucun visage détecté dans le cadre');
              }
            }
            noFaceTimeout.current = null;
          }, toleranceSettings.noFace);
        }
      } else if (noFaceTimeout.current) {
        clearTimeout(noFaceTimeout.current);
        noFaceTimeout.current = null;
      }
      
      // 3. Mouvements suspects (mouvement rapide)
      if (avgMovementScore > 40) { // Seuil pour mouvements suspects
        if (!movementTimeout.current) {
          movementTimeout.current = setTimeout(() => {
            if (detectionStats.movementDetected && !expulsionTriggered) {
              const cheatType = 'rapid_movement';
              const lastTime = lastCheatTime.current[cheatType];
              
              if (now - lastTime > SAME_CHEAT_COOLDOWN) {
                lastCheatTime.current[cheatType] = now;
                handleCheat(cheatType, 'Mouvements suspects détectés');
              }
            }
            movementTimeout.current = null;
          }, toleranceSettings.rapidMovement);
        }
      } else if (movementTimeout.current) {
        clearTimeout(movementTimeout.current);
        movementTimeout.current = null;
      }
      
      // 4. Yeux couverts (lunettes noires, main, etc.)
      if (eyesCovered) {
        if (!eyesCoveredTimeout.current) {
          eyesCoveredTimeout.current = setTimeout(() => {
            if (detectionStats.eyesCovered && !expulsionTriggered) {
              const cheatType = 'eyes_covered';
              const lastTime = lastCheatTime.current[cheatType];
              
              if (now - lastTime > SAME_CHEAT_COOLDOWN) {
                lastCheatTime.current[cheatType] = now;
                handleCheat(cheatType, 'Yeux non visibles ou couverts');
              }
            }
            eyesCoveredTimeout.current = null;
          }, toleranceSettings.eyesCovered);
        }
      } else if (eyesCoveredTimeout.current) {
        clearTimeout(eyesCoveredTimeout.current);
        eyesCoveredTimeout.current = null;
      }
      
    } catch (error) {
      console.error("Erreur lors de la détection des visages:", error);
    }
  };

  // Gérer les changements de fenêtre
  const handleVisibilityChange = () => {
    const now = Date.now();
    
    // Si déjà expulsé, ne pas continuer avec la détection
    if (expulsionTriggered) return;
    
    if (document.hidden) {
      // L'utilisateur a changé de fenêtre
      lastActiveTime.current = now;
      windowChangeCount.current += 1;
      
      // Vérifier après le délai de tolérance
      if (!windowFocusTimeout.current) {
        windowFocusTimeout.current = setTimeout(() => {
          if (document.hidden && !expulsionTriggered) {
            const cheatType = 'window_change';
            const lastTime = lastCheatTime.current[cheatType];
            
            // Vérifier si assez de temps s'est écoulé depuis la dernière alerte de ce type
            if (now - lastTime > SAME_CHEAT_COOLDOWN) {
              lastCheatTime.current[cheatType] = now;
              handleCheat(cheatType, `Changement de fenêtre #${windowChangeCount.current} détecté`);
            }
          }
          windowFocusTimeout.current = null;
        }, toleranceSettings.windowChange);
      }
    } else {
      // L'utilisateur est revenu
      const timeAway = now - lastActiveTime.current;
      
      // Si l'utilisateur était absent suffisamment longtemps mais est revenu avant le timeout
      if (timeAway > 500 && timeAway < toleranceSettings.windowChange) {
        // Si trop de changements rapides, considérer comme triche
        if (windowChangeCount.current >= 3 && !expulsionTriggered) {
          const cheatType = 'multiple_window_changes';
          const lastTime = lastCheatTime.current[cheatType];
          
          // Vérifier si assez de temps s'est écoulé depuis la dernière alerte de ce type
          if (now - lastTime > SAME_CHEAT_COOLDOWN) {
            lastCheatTime.current[cheatType] = now;
            handleCheat(cheatType, `${windowChangeCount.current} changements de fenêtre rapides détectés`);
            windowChangeCount.current = 0; // Réinitialiser le compteur
          }
        }
      }
      
      // L'utilisateur est revenu à temps
      if (windowFocusTimeout.current) {
        clearTimeout(windowFocusTimeout.current);
        windowFocusTimeout.current = null;
      }
    }
  };

  // Gestion de la triche - Version simplifiée avec expulsion immédiate
const handleCheat = (type, message) => {
    console.log(`TRICHE DÉTECTÉE: ${type} - ${message}`);
    
    // Éviter les appels multiples
    if (expulsionTriggered) return;
    setExpulsionTriggered(true);
    
    // Marquer comme triche détectée
    setCheatDetected(true);
    
    // Obtenir un message personnalisé selon le type de triche
    const getCheatMessage = (cheatType) => {
      switch(cheatType) {
        case 'window_change':
          return "Vous avez changé de fenêtre pendant l'examen.";
        case 'multiple_window_changes':
          return "Vous avez effectué plusieurs changements de fenêtre suspects.";
        case 'multiple_faces':
          return "Plusieurs personnes ont été détectées devant la caméra.";
        case 'no_face':
          return "Aucun visage n'a été détecté devant la caméra.";
        case 'rapid_movement':
          return "Des mouvements suspects ont été détectés.";
        case 'eyes_covered':
          return "Vos yeux ne sont pas visibles ou sont couverts.";
        default:
          return "Un comportement suspect a été détecté.";
      }
    };
    
    // Afficher le message d'alerte
    const userMessage = getCheatMessage(type);
    alert(`TRICHE DÉTECTÉE: ${userMessage}\n\nLa page d'examen va se fermer automatiquement.`);
    
    // Notifier le composant parent
    if (onCheatDetected) {
      onCheatDetected({
        examId,
        type,
        message,
        timestamp: new Date().toISOString(),
        isExpelled: true
      });
    }
    
    // Rediriger immédiatement après un court délai
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };
  
  // Callback pour la webcam prête
  const handleWebcamReady = () => {
    console.log("Webcam prête");
    setWebcamReady(true);
    setWebcamError(false);
  };
  
  // Gestion des erreurs de webcam
  const handleWebcamError = (error) => {
    console.error("Erreur de webcam:", error);
    setWebcamReady(false);
    setWebcamError(true);
  };

  // Démarrer la surveillance
  const startMonitoring = () => {
    console.log("Démarrage de la surveillance");
    // Détection régulière des visages
    if (detectionInterval.current) clearInterval(detectionInterval.current);
    detectionInterval.current = setInterval(detectFaces, 1000);
    
    // Détection de changement de fenêtre
    document.addEventListener('visibilitychange', handleVisibilityChange);
  };

  // Initialisation et nettoyage
  useEffect(() => {
    // Vérifier si la webcam est prête avant de démarrer
    if (webcamReady) {
      console.log("Initialisation de la détection");
      startMonitoring();
    }
    
    return () => {
      console.log("Nettoyage des ressources");
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
      if (windowFocusTimeout.current) {
        clearTimeout(windowFocusTimeout.current);
      }
      if (noFaceTimeout.current) {
        clearTimeout(noFaceTimeout.current);
      }
      if (multipleFacesTimeout.current) {
        clearTimeout(multipleFacesTimeout.current);
      }
      if (movementTimeout.current) {
        clearTimeout(movementTimeout.current);
      }
      if (eyesCoveredTimeout.current) {
        clearTimeout(eyesCoveredTimeout.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [webcamReady]);
  
  // Mettre à jour les paramètres si les props changent
  useEffect(() => {
    console.log("Mise à jour des paramètres de tolérance:", tolerance);
  }, [tolerance]);

  return (
    <Card elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Surveillance d'examen</Typography>
          <Chip 
            label={cheatCount > 0 ? `Infractions: ${cheatCount}/${maxCheats}` : "Surveillance active"} 
            color={cheatCount > 0 ? (cheatCount >= maxCheats ? "error" : "warning") : "success"}
            size="small"
          />
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        {/* Conteneur de la webcam */}
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: '300px',
          border: '1px solid #ddd',
          borderRadius: 2,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'rgba(0,0,0,0.03)'
        }}>
          {webcamError && (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <VideocamOffIcon color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body2" color="error">
                Impossible d'accéder à la caméra.<br />Veuillez autoriser l'accès et recharger la page.
              </Typography>
            </Box>
          )}
          
          {!webcamReady && !webcamError && (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress size={40} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Initialisation...
              </Typography>
            </Box>
          )}
          
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            width="100%"
            height="100%"
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 640,
              height: 480,
              facingMode: "user"
            }}
            onUserMedia={handleWebcamReady}
            onUserMediaError={handleWebcamError}
            style={{ 
              display: webcamReady ? 'block' : 'none',
              objectFit: 'cover'
            }}
          />
          
          {/* Overlay d'état */}
          {webcamReady && (
            <Box sx={{ 
              position: 'absolute', 
              bottom: 0, 
              left: 0, 
              right: 0, 
              p: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: 'rgba(0,0,0,0.5)',
            }}>
              <Typography variant="caption" sx={{ color: 'white' }}>
                Visages: {detectionStats.facesDetected}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  size="small" 
                  onClick={() => setShowDebug(!showDebug)}
                  sx={{ color: 'white' }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
                
                <Badge
                  color={detectionStats.faceVisible ? "success" : "error"}
                  variant="dot"
                  overlap="circular"
                >
                  <VideocamIcon sx={{ color: 'white', ml: 1 }} fontSize="small" />
                </Badge>
              </Box>
            </Box>
          )}
          
          {/* Canvas de débogage */}
          {showDebug && (
            <canvas
              ref={debugCanvasRef}
              width={320}
              height={240}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                border: '1px solid red',
                backgroundColor: 'white',
                zIndex: 10,
                maxWidth: '150px',
                maxHeight: '120px'
              }}
            />
          )}
        </Box>
        
        {/* Alerte de triche */}
        {cheatDetected && (
          <Alert severity={cheatCount >= maxCheats ? "error" : "warning"} sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>{cheatCount >= maxCheats ? "Alerte critique" : "Alerte de sécurité"}:</strong> {' '}
              {cheatCount >= maxCheats 
                ? "Vous allez être expulsé de l'examen." 
                : "Comportement suspect détecté."}
              {' '}Infractions: {cheatCount}/{maxCheats}
            </Typography>
          </Alert>
        )}
        
        {/* Messages d'instructions */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Restez visible devant la caméra à tout moment
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            • Ne changez pas de fenêtre ou d'onglet pendant l'examen
          </Typography>
          <Typography 
            variant="caption" 
            color={cheatCount > 0 ? "error" : "text.secondary"} 
            sx={{ display: 'block', fontWeight: cheatCount > 0 ? 'bold' : 'normal' }}
          >
            • Après {maxCheats} infractions, vous serez automatiquement expulsé
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CheatDetectionComponent;