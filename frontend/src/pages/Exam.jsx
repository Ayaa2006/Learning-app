// src/pages/Exam.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  FormControl, 
  FormControlLabel, 
  Radio, 
  RadioGroup,
  TextField,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { examService } from '../services/api';
import { useProgress } from '../context/ProgressContext';

// Composant pour surveiller la présence de l'utilisateur
const ProctoringComponent = ({ onViolation }) => {
  const webcamRef = useRef(null);
  const [warning, setWarning] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Surveiller les changements de focus de la fenêtre
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarning(true);
        setWarningCount(prev => prev + 1);
        
        if (warningCount >= 2) {
          onViolation("L'utilisateur a quitté l'onglet de l'examen plusieurs fois");
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onViolation, warningCount]);
  
  // Demander le mode plein écran au chargement
  useEffect(() => {
    const requestFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch (error) {
        console.error("Impossible de passer en mode plein écran:", error);
      }
    };
    
    requestFullscreen();
    
    // Surveiller les sorties du mode plein écran
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        setWarning(true);
        setWarningCount(prev => prev + 1);
        
        if (warningCount >= 2) {
          onViolation("L'utilisateur a quitté le mode plein écran plusieurs fois");
        }
      } else {
        setIsFullscreen(true);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      // Sortir du mode plein écran à la fin
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, [onViolation, warningCount]);
  
  return (
    <Box>
      {warning && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Attention: Ne quittez pas la page d'examen. Toute tentative de triche sera signalée.
          {warningCount > 0 && ` (Avertissement ${warningCount}/3)`}
        </Alert>
      )}
      
      {!isFullscreen && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Veuillez passer en mode plein écran pour continuer l'examen.
          <Button 
            variant="outlined" 
            size="small" 
            sx={{ ml: 2 }}
            onClick={() => document.documentElement.requestFullscreen()}
          >
            Activer le plein écran
          </Button>
        </Alert>
      )}
    </Box>
  );
};

// Composant principal de l'examen
const Exam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { submitExam } = useProgress();
  
  const [exam, setExam] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [proctoringViolation, setProctoringViolation] = useState(null);
  
  // Charger les données de l'examen
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const response = await examService.getExamById(examId);
        setExam(response.data);
        
        // Initialiser les réponses vides
        const initialAnswers = {};
        response.data.questions.forEach((question) => {
          initialAnswers[question.id] = '';
        });
        setAnswers(initialAnswers);
        
        // Initialiser le temps restant
        setTimeLeft(response.data.timeLimit * 60); // Convertir en secondes
        
        setError(null);
      } catch (err) {
        setError("Erreur lors du chargement de l'examen");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);
  
  // Gérer le décompte du temps
  useEffect(() => {
    if (!timeLeft || timeLeft <= 0 || examSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, examSubmitted]);
  
  // Soumettre automatiquement l'examen lorsque le temps est écoulé
  useEffect(() => {
    if (timeLeft === 0 && !examSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, examSubmitted]);

  // Gérer le changement de réponse
  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Passer à la question suivante
  const handleNext = () => {
    if (currentQuestion < exam.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Revenir à la question précédente
  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Soumettre l'examen
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await submitExam(examId, answers);
      setResult(response);
      setExamSubmitted(true);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la soumission de l'examen");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Gérer une violation de surveillance
  const handleProctoringViolation = (reason) => {
    setProctoringViolation(reason);
    // Soumettre automatiquement l'examen avec une note de 0
    submitExam(examId, {}, true);
    setExamSubmitted(true);
  };

  // Formater le temps restant
  const formatTimeLeft = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Retourner à la page de progression
  const handleReturnToProgress = () => {
    navigate('/progress');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={handleReturnToProgress} sx={{ mt: 2 }}>
          Retour à la progression
        </Button>
      </Box>
    );
  }

  if (!exam) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">Examen introuvable.</Alert>
        <Button variant="contained" onClick={handleReturnToProgress} sx={{ mt: 2 }}>
          Retour à la progression
        </Button>
      </Box>
    );
  }
  
  // Si une violation de surveillance a été détectée
  if (proctoringViolation) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', color: 'error.main' }}>
            Examen terminé - Violation détectée
          </Typography>
          
          <Alert severity="error" sx={{ my: 4 }}>
            {proctoringViolation}. Votre examen a été automatiquement soumis avec une note de 0.
          </Alert>
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleReturnToProgress}
              size="large"
            >
              Retour à mon parcours
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Afficher les résultats si l'examen est soumis
  if (examSubmitted && result) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Résultats de l'Examen
          </Typography>
          
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Typography variant="h2" color={result.score >= exam.passingScore ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
              {result.score}%
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {result.correctAnswers} questions correctes sur {exam.questions.length}
            </Typography>
            
            {result.score >= exam.passingScore ? (
              <Alert severity="success" sx={{ mt: 2 }}>
                Félicitations ! Vous avez réussi cet examen. Le module est maintenant validé.
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Vous n'avez pas atteint le score minimum requis ({exam.passingScore}%). Vous devrez refaire le module.
              </Alert>
            )}
          </Box>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
            Détails des réponses
          </Typography>
          
          {exam.questions.map((question, index) => (
            <Card key={question.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Question {index + 1}: {question.text}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Votre réponse: {answers[question.id]}
                </Typography>
                
                <Typography 
                  variant="body2"
                  color={result.correctQuestions.includes(question.id) ? "success.main" : "error.main"}
                  sx={{ fontWeight: 'bold' }}
                >
                  Réponse correcte: {question.correctAnswer}
                </Typography>
                
                {question.explanation && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                    {question.explanation}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleReturnToProgress}
              size="large"
            >
              Retour à mon parcours
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  // Afficher l'examen
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Composant de surveillance (proctoring) */}
      <ProctoringComponent onViolation={handleProctoringViolation} />
      
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {exam.title}
          </Typography>
          
          <Card sx={{ px: 3, py: 1, bgcolor: timeLeft < 300 ? 'error.light' : 'info.light' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Temps restant: {formatTimeLeft(timeLeft)}
            </Typography>
          </Card>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={(1 - timeLeft / (exam.timeLimit * 60)) * 100} 
          color={timeLeft < 300 ? "error" : "primary"}
          sx={{ height: 8, borderRadius: 2, mb: 3 }}
        />
        
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={currentQuestion} alternativeLabel>
            {exam.questions.map((_, index) => (
              <Step key={index}>
                <StepLabel></StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestion + 1} sur {exam.questions.length}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {exam.questions[currentQuestion].text}
          </Typography>
          
          <FormControl component="fieldset" sx={{ width: '100%' }}>
            {exam.questions[currentQuestion].type === 'multiple_choice' ? (
              <RadioGroup 
                value={answers[exam.questions[currentQuestion].id] || ''}
                onChange={(e) => handleAnswerChange(exam.questions[currentQuestion].id, e.target.value)}
              >
                {exam.questions[currentQuestion].options.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.text}
                    sx={{ mb: 1 }}
                  />
                ))}
              </RadioGroup>
            ) : (
              <TextField
                fullWidth
                label="Votre réponse"
                variant="outlined"
                value={answers[exam.questions[currentQuestion].id] || ''}
                onChange={(e) => handleAnswerChange(exam.questions[currentQuestion].id, e.target.value)}
                sx={{ mt: 2 }}
              />
            )}
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={handleBack} 
            disabled={currentQuestion === 0}
            variant="outlined"
          >
            Question précédente
          </Button>
          
          {currentQuestion < exam.questions.length - 1 ? (
            <Button 
              onClick={handleNext} 
              variant="contained"
            >
              Question suivante
            </Button>
          ) : (
            <Button 
              onClick={() => setConfirmSubmit(true)} 
              variant="contained" 
              color="success"
            >
              Terminer l'examen
            </Button>
          )}
        </Box>
      </Paper>
      
      {/* Dialogue de confirmation de soumission */}
      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
      >
        <DialogTitle>
          Confirmer la soumission de l'examen
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir soumettre votre examen ? 
            {Object.values(answers).some(a => a === '') && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Attention: Certaines questions n'ont pas de réponse.
              </Alert>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmSubmit(false)} color="primary">
            Continuer l'examen
          </Button>
          <Button onClick={handleSubmit} color="error" variant="contained">
            Soumettre l'examen
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Exam;