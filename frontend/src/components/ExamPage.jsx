import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Box, 
  Container, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';

// Composant de détection de triche amélioré
const CheatDetectionComponent = ({ examId, onCheatDetected, tolerance = {} }) => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const [isLoading, setIsLoading] = useState(true);
  const [facesCount, setFacesCount] = useState(1);
  
  const timerRef = useRef(null);
  const detectionInterval = useRef(null);
  const previousPixelData = useRef(null);
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };
  
  // Vérifier si l'utilisateur a changé de fenêtre
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // L'utilisateur a changé de fenêtre ou d'onglet
        setTimeout(() => {
          if (document.hidden && onCheatDetected) {
            onCheatDetected({
              type: 'window_change',
              message: 'Changement de fenêtre détecté',
              timestamp: new Date().toISOString()
            });
          }
        }, (tolerance.windowChange || 2) * 1000);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onCheatDetected, tolerance.windowChange]);
  
  // Simuler le chargement
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Nettoyage
  useEffect(() => {
    return () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  
  // Fonction pour détecter les visages basée sur la détection de couleur de peau
  const detectFaces = (imageData, width, height) => {
    const data = imageData.data;
    
    // Carte des pixels de couleur peau
    let skinPixels = [];
    
    // Parcourir les pixels (avec échantillonnage pour la performance)
    for (let y = 0; y < height; y += 5) {
      for (let x = 0; x < width; x += 5) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // Vérification approximative de couleur peau (r > g > b)
        if (r > 95 && g > 40 && b > 20 && r > g && g > b && 
            r - g > 15 && r - b > 15) {
          skinPixels.push({x, y});
        }
      }
    }
    
    // Si pas assez de pixels de peau, probablement pas de visage
    if (skinPixels.length < 10) return 0;
    
    // Algorithme simple de clustering pour identifier les visages
    let clusters = [];
    const distanceThreshold = 50; // Distance max entre pixels d'un même visage
    
    for (const pixel of skinPixels) {
      let foundCluster = false;
      
      for (const cluster of clusters) {
        // Vérifier si le pixel appartient à un cluster existant
        for (const clusterPixel of cluster) {
          const distance = Math.sqrt(
            Math.pow(pixel.x - clusterPixel.x, 2) + 
            Math.pow(pixel.y - clusterPixel.y, 2)
          );
          
          if (distance < distanceThreshold) {
            cluster.push(pixel);
            foundCluster = true;
            break;
          }
        }
        
        if (foundCluster) break;
      }
      
      // Si le pixel n'appartient à aucun cluster existant, créer un nouveau
      if (!foundCluster) {
        clusters.push([pixel]);
      }
    }
    
    // Filtrer les clusters trop petits pour être des visages
    const faceClusters = clusters.filter(cluster => cluster.length > 30);
    
    return faceClusters.length;
  };
  
  // Initialisation de la caméra
  const handleUserMedia = () => {
    startFaceDetection();
  };
  
  // Démarrer la détection des visages
  const startFaceDetection = () => {
    if (detectionInterval.current) clearInterval(detectionInterval.current);
    
    detectionInterval.current = setInterval(() => {
      if (!webcamRef.current || !webcamRef.current.video) {
        return;
      }
      
      try {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Configurer le canvas
        canvas.width = 200;  // Résolution réduite pour la performance
        canvas.height = 150;
        
        // Capturer une image de la webcam
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Détecter le nombre de visages
        const numFaces = detectFaces(imageData, canvas.width, canvas.height);
        setFacesCount(numFaces);
        
        // Vérifier s'il y a plusieurs visages
        if (numFaces > 1) {
          if (onCheatDetected) {
            onCheatDetected({
              type: 'multiple_faces',
              message: `${numFaces} visages détectés`,
              timestamp: new Date().toISOString()
            });
          }
        }
        
        // Vérifier s'il n'y a pas de visage
        if (numFaces === 0) {
          // Attendre quelques secondes avant de déclencher l'alerte
          setTimeout(() => {
            // Vérifier à nouveau après le délai
            if (facesCount === 0 && onCheatDetected) {
              onCheatDetected({
                type: 'no_face',
                message: 'Aucun visage détecté',
                timestamp: new Date().toISOString()
              });
            }
          }, (tolerance.headMovement || 4) * 1000);
        }
        
      } catch (error) {
        console.error("Erreur lors de la détection:", error);
      }
    }, 1000); // Vérifier chaque seconde
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, mb: 3, position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h3">
          Surveillance d'examen
        </Typography>
        <Typography variant="body2" color={facesCount === 1 ? "success.main" : "error.main"}>
          {facesCount === 0 ? "Aucun visage détecté" : 
           facesCount === 1 ? "1 visage détecté" : 
           `${facesCount} visages détectés`}
        </Typography>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', my: 4 }}>
          <CircularProgress color="primary" />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Initialisation du système de surveillance...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          position: 'relative', 
          width: '100%', 
          height: 'auto', 
          maxWidth: '320px', 
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
        </Box>
      )}
    </Paper>
  );
};

// Composant de Question
function QuestionComponent() {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      id: 1,
      text: "Quelle est la capitale de la France ?",
      options: [
        { id: 'a', text: "Londres" },
        { id: 'b', text: "Berlin" },
        { id: 'c', text: "Paris" },
        { id: 'd', text: "Rome" }
      ]
    }
  ];

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  return (
    <Box>
      {questions.map(question => (
        <Box key={question.id}>
          <Typography variant="h6" gutterBottom>
            {question.text}
          </Typography>
          <RadioGroup 
            value={selectedAnswer} 
            onChange={handleAnswerSelect}
          >
            {question.options.map(option => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={<Radio />}
                label={option.text}
              />
            ))}
          </RadioGroup>
        </Box>
      ))}
    </Box>
  );
}

// Composant de Réponse
function AnswerComponent() {
  const [answers, setAnswers] = useState('');

  const handleSubmit = () => {
    console.log("Réponses soumises:", answers);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Réponse Ouverte
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        value={answers}
        onChange={(e) => setAnswers(e.target.value)}
        placeholder="Saisissez votre réponse ici..."
        sx={{ mb: 2 }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleSubmit}
        fullWidth
      >
        Soumettre
      </Button>
    </Box>
  );
}

// Composant principal ExamPage
function ExamPage() {
  const navigate = useNavigate();
  const [openCheatDialog, setOpenCheatDialog] = useState(false);
  const [cheatInfo, setCheatInfo] = useState(null);
  
  const currentExamId = "exam-123"; 
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 heure en secondes

  // Effet pour le compte à rebours
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formater le temps restant
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestionnaire de détection de triche
  const handleCheatDetected = (cheatDetectionInfo) => {
    console.log('Triche détectée:', cheatDetectionInfo);
    
    // Ouvrir le dialogue d'alerte de triche
    setCheatInfo(cheatDetectionInfo);
    setOpenCheatDialog(true);
  };

  // Fermer le dialogue et rediriger
  const handleCloseCheatDialog = () => {
    setOpenCheatDialog(false);
    // Rediriger vers une page appropriée (par exemple, la page d'accueil ou une page d'informations)
    navigate('/');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '20px' 
      }}>
        {/* En-tête de l'examen */}
        <Box sx={{ 
          width: '100%', 
          textAlign: 'center', 
          marginBottom: '20px' 
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Examen en Cours
          </Typography>
          <Typography variant="subtitle1">
            Temps restant : {formatTime(timeRemaining)} | Examen : {currentExamId}
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          width: '100%',
          gap: 3
        }}>
          {/* Panneau gauche - Webcam */}
          <Box sx={{ width: { xs: '100%', md: '30%' } }}>
            <CheatDetectionComponent 
              examId={currentExamId} 
              onCheatDetected={handleCheatDetected}
              tolerance={{
                windowChange: 2,
                headMovement: 4,
                lookAway: 3,
                multiplePersons: 1
              }}
            />
          </Box>

          {/* Panneau droit - Questions */}
          <Box sx={{ 
            width: { xs: '100%', md: '70%' },
            bgcolor: 'background.paper',
            p: 3,
            borderRadius: 1,
            boxShadow: 1
          }}>
            {/* Composant des questions */}
            <QuestionComponent />

            {/* Composant de réponse */}
            <Box sx={{ mt: 4 }}>
              <AnswerComponent />
            </Box>
          </Box>
        </Box>

        {/* Pied de page */}
        <Box sx={{ 
          marginTop: '20px', 
          textAlign: 'center' 
        }}>
          <Typography variant="body2" color="text.secondary">
            Système de surveillance actif
          </Typography>
        </Box>

        {/* Dialogue de triche */}
        <Dialog
          open={openCheatDialog}
          onClose={handleCloseCheatDialog}
          aria-labelledby="cheat-alert-dialog-title"
          aria-describedby="cheat-alert-dialog-description"
        >
          <DialogTitle id="cheat-alert-dialog-title" color="error">
            {"Violation des Règles de l'Examen"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="cheat-alert-dialog-description">
              Désolé, vous n'avez pas le droit de passer l'examen.

              Un comportement suspect a été détecté pendant l'examen. 
              Cela peut inclure :
              - Plusieurs visages détectés
              - Changement de fenêtre
              - Mouvements suspects
              - Position incorrecte

              Détails de la violation :
              {cheatInfo && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="body2">
                    Type : {cheatInfo.type}
                    <br />
                    Message : {cheatInfo.message}
                    <br />
                    Horodatage : {new Date(cheatInfo.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              )}

              Veuillez contacter l'administration pour plus d'informations.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCloseCheatDialog} 
              color="primary" 
              autoFocus
            >
              Comprendre
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default ExamPage;