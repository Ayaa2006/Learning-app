// src/pages/CreateQCM.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Help as HelpIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FileCopy as FileCopyIcon,
  Shuffle as ShuffleIcon
} from '@mui/icons-material';
import AdminLayout from '../components/layouts/TeacherLayout';
import { useAuth } from '../contexts/AuthContext';
import TeacherLayout from '../components/layouts/TeacherLayout';

// Données fictives des cours disponibles
const mockCourses = [
  { id: 1, title: "Introduction aux Variables JS", moduleId: 1 },
  { id: 2, title: "Fonctions et Portée", moduleId: 1 },
  { id: 3, title: "Promesses et Async/Await", moduleId: 2 },
  { id: 4, title: "Gestion des États React", moduleId: 3 },
  { id: 5, title: "API REST avec Express", moduleId: 4 }
];

// Données fictives des modules disponibles
const mockModules = [
  { id: 1, title: "Introduction à JavaScript" },
  { id: 2, title: "JavaScript Avancé" },
  { id: 3, title: "Frameworks Frontend" },
  { id: 4, title: "Développement Backend" },
  { id: 5, title: "Bases de Données" }
];

// Types de questions disponibles
const questionTypes = [
  { value: 'single', label: 'Choix unique' },
  { value: 'multiple', label: 'Choix multiple' },
  { value: 'true_false', label: 'Vrai/Faux' }
];

const CreateQCM = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState({ show: false, message: '', type: 'info' });
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // États du formulaire
  const [qcmData, setQcmData] = useState({
    title: '',
    courseId: '',
    description: '',
    timeLimit: 0, // En minutes, 0 = pas de limite
    passingScore: 70, // Score en pourcentage pour réussir le QCM
    isPublished: false,
    showCorrectAnswers: true, // Montrer les réponses correctes après soumission
    shuffleQuestions: false, // Mélanger l'ordre des questions
    questions: [
      {
        text: '',
        type: 'single',
        points: 1,
        explanation: '', // Explication affichée après la réponse
        options: [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false }
        ]
      }
    ]
  });
  
  // Vérifier les permissions
  useEffect(() => {
    if (!hasPermission('createQCM')) {
      navigate('/admin-qcm');
    }
  }, [hasPermission, navigate]);
  
  // Étapes du stepper
  const steps = [
    'Informations générales',
    'Création des questions',
    'Paramètres et aperçu'
  ];
  
  // Gérer le changement d'étape
  const handleNext = () => {
    // Valider l'étape actuelle
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      // Simuler une sauvegarde automatique
      handleAutoSave();
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Valider l'étape actuelle
  const validateCurrentStep = () => {
    if (activeStep === 0) {
      // Valider les informations générales
      if (!qcmData.title || !qcmData.courseId) {
        setSavingStatus({
          show: true,
          message: 'Veuillez remplir tous les champs obligatoires',
          type: 'error'
        });
        return false;
      }
    } else if (activeStep === 1) {
      // Valider les questions
      const invalidQuestions = qcmData.questions.filter(q => 
        !q.text || q.options.length < 2 || !q.options.some(opt => opt.text)
      );
      
      if (invalidQuestions.length > 0) {
        setSavingStatus({
          show: true,
          message: 'Certaines questions sont incomplètes ou invalides',
          type: 'error'
        });
        return false;
      }
      
      // Vérifier que chaque question a au moins une réponse correcte
      const noCorrectAnswer = qcmData.questions.some(q => 
        !q.options.some(opt => opt.isCorrect)
      );
      
      if (noCorrectAnswer) {
        setSavingStatus({
          show: true,
          message: 'Chaque question doit avoir au moins une réponse correcte',
          type: 'error'
        });
        return false;
      }
    }
    
    return true;
  };
  
  // Gérer les changements dans le formulaire général
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQcmData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer les changements de switch/checkbox
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setQcmData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Gérer les changements dans une question
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...qcmData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setQcmData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Gérer les changements dans une option de question
  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...qcmData.questions];
    const options = [...updatedQuestions[questionIndex].options];
    
    // Si on change isCorrect et que le type est 'single', désélectionner les autres options
    if (field === 'isCorrect' && value === true && updatedQuestions[questionIndex].type === 'single') {
      options.forEach((opt, idx) => {
        options[idx] = { ...opt, isCorrect: idx === optionIndex };
      });
    } else {
      options[optionIndex] = { ...options[optionIndex], [field]: value };
    }
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    
    setQcmData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Ajouter une question
  const handleAddQuestion = () => {
    const newQuestion = {
      text: '',
      type: 'single',
      points: 1,
      explanation: '',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    };
    
    setQcmData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    
    // Passer à la nouvelle question
    setCurrentQuestionIndex(qcmData.questions.length);
  };
  
  // Supprimer une question
  const handleRemoveQuestion = (index) => {
    if (qcmData.questions.length <= 1) {
      setSavingStatus({
        show: true,
        message: 'Un QCM doit contenir au moins une question',
        type: 'error'
      });
      return;
    }
    
    const updatedQuestions = [...qcmData.questions];
    updatedQuestions.splice(index, 1);
    
    setQcmData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
    
    // Ajuster l'index courant si nécessaire
    if (currentQuestionIndex >= updatedQuestions.length) {
      setCurrentQuestionIndex(updatedQuestions.length - 1);
    }
  };
  
  // Ajouter une option à une question
  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...qcmData.questions];
    const options = [...updatedQuestions[questionIndex].options];
    
    // Trouver le plus grand ID existant et ajouter 1
    const maxId = Math.max(...options.map(opt => opt.id), 0);
    options.push({ id: maxId + 1, text: '', isCorrect: false });
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    
    setQcmData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Supprimer une option
  const handleRemoveOption = (questionIndex, optionIndex) => {
    const question = qcmData.questions[questionIndex];
    
    if (question.options.length <= 2) {
      setSavingStatus({
        show: true,
        message: 'Une question doit avoir au moins deux options',
        type: 'error'
      });
      return;
    }
    
    const updatedQuestions = [...qcmData.questions];
    const options = [...updatedQuestions[questionIndex].options];
    options.splice(optionIndex, 1);
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    
    setQcmData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Déplacer une question vers le haut
  const handleMoveQuestionUp = (index) => {
    if (index === 0) return;
    
    const updatedQuestions = [...qcmData.questions];
    [updatedQuestions[index - 1], updatedQuestions[index]] = 
      [updatedQuestions[index], updatedQuestions[index - 1]];
    
    setQcmData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
    
    setCurrentQuestionIndex(index - 1);
  };
  
  // Déplacer une question vers le bas
  const handleMoveQuestionDown = (index) => {
    if (index === qcmData.questions.length - 1) return;
    
    const updatedQuestions = [...qcmData.questions];
    [updatedQuestions[index], updatedQuestions[index + 1]] = 
      [updatedQuestions[index + 1], updatedQuestions[index]];
    
    setQcmData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
    
    setCurrentQuestionIndex(index + 1);
  };
  
  // Dupliquer une question
  const handleDuplicateQuestion = (index) => {
    const questionToDuplicate = { ...qcmData.questions[index] };
    const updatedQuestions = [...qcmData.questions];
    
    // Insérer la copie après la question originale
    updatedQuestions.splice(index + 1, 0, questionToDuplicate);
    
    setQcmData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
    
    // Sélectionner la nouvelle question
    setCurrentQuestionIndex(index + 1);
  };
  
  // Sauvegarde automatique
  const handleAutoSave = () => {
    setSavingStatus({
      show: true,
      message: 'Enregistrement automatique en cours...',
      type: 'info'
    });
    
    setTimeout(() => {
      setSavingStatus({
        show: true,
        message: 'Modifications enregistrées avec succès',
        type: 'success'
      });
      
      // Masquer le message après quelques secondes
      setTimeout(() => {
        setSavingStatus(prev => ({ ...prev, show: false }));
      }, 3000);
    }, 1000);
  };
  
  // Soumettre le formulaire
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setLoading(true);
    setSavingStatus({
      show: true,
      message: 'Enregistrement du QCM en cours...',
      type: 'info'
    });
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSavingStatus({
        show: true,
        message: 'QCM créé avec succès',
        type: 'success'
      });
      
      // Rediriger vers la liste des QCM après un délai
      setTimeout(() => {
        navigate('/admin-qcm');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la création du QCM:', error);
      setSavingStatus({
        show: true,
        message: 'Erreur lors de la création du QCM',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Prévisualiser le QCM
  const handlePreview = () => {
    // Dans une implémentation réelle, vous pourriez ouvrir une modal ou une nouvelle page
    console.log('Prévisualisation du QCM:', qcmData);
    
    setSavingStatus({
      show: true,
      message: 'Fonctionnalité de prévisualisation à implémenter',
      type: 'info'
    });
  };
  
  return (
    <TeacherLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
      <Box sx={{ py: 4, bgcolor: darkMode ? 'background.default' : '#f5f7fb', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => navigate('/admin-qcm')} 
                sx={{ mr: 2 }}
                color="inherit"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Créer un nouveau QCM
              </Typography>
            </Box>
            
            <Box>
              <Button 
                variant="outlined" 
                sx={{ mr: 2 }}
                onClick={handlePreview}
                startIcon={<VisibilityIcon />}
              >
                Prévisualiser
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{ 
                  bgcolor: '#ff9900', 
                  '&:hover': { bgcolor: '#e68a00' } 
                }}
              >
                {activeStep === steps.length - 1 ? 'Publier le QCM' : 'Enregistrer'}
              </Button>
            </Box>
          </Box>
          
          {/* Message de statut */}
          {savingStatus.show && (
            <Alert 
              severity={savingStatus.type} 
              sx={{ mb: 3 }}
              onClose={() => setSavingStatus(prev => ({ ...prev, show: false }))}
            >
              {savingStatus.message}
            </Alert>
          )}
          
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Étape 1: Informations générales */}
          {activeStep === 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Informations générales du QCM
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Titre du QCM"
                    name="title"
                    value={qcmData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Donnez un titre clair et descriptif à votre QCM"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Cours associé</InputLabel>
                    <Select
                      name="courseId"
                      value={qcmData.courseId}
                      onChange={handleChange}
                      label="Cours associé"
                    >
                      {mockCourses.map((course) => (
                        <MenuItem key={course.id} value={course.id}>
                          {course.title} ({mockModules.find(m => m.id === course.moduleId)?.title})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Score minimal pour réussir (%)"
                    name="passingScore"
                    type="number"
                    value={qcmData.passingScore}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                    helperText="Pourcentage minimal requis pour valider le QCM"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Temps limite (minutes)"
                    name="timeLimit"
                    type="number"
                    value={qcmData.timeLimit}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{ inputProps: { min: 0 } }}
                    helperText="0 = pas de limite de temps"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={qcmData.shuffleQuestions}
                        onChange={handleSwitchChange}
                        name="shuffleQuestions"
                        color="primary"
                      />
                    }
                    label="Mélanger l'ordre des questions"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    name="description"
                    value={qcmData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    helperText="Description facultative du contenu et des objectifs du QCM"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    bgcolor: '#ff9900', 
                    '&:hover': { bgcolor: '#e68a00' } 
                  }}
                >
                  Suivant
                </Button>
              </Box>
            </Paper>
          )}
          
          {/* Étape 2: Création des questions */}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              {/* Liste des questions (barre latérale) */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Questions ({qcmData.questions.length})
                    </Typography>
                    <Tooltip title="Aide">
                      <IconButton size="small" onClick={() => setHelpDialogOpen(true)}>
                        <HelpIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    {qcmData.questions.map((question, index) => (
                      <Paper 
                        key={index} 
                        elevation={0}
                        sx={{ 
                          p: 2, 
                          mb: 1, 
                          border: '1px solid',
                          borderColor: currentQuestionIndex === index ? '#ff9900' : '#e0e0e0',
                          bgcolor: currentQuestionIndex === index ? '#fff9e6' : 'background.paper',
                          cursor: 'pointer'
                        }}
                        onClick={() => setCurrentQuestionIndex(index)}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 500, wordBreak: 'break-word', flex: 1 }}>
                            {index + 1}. {question.text || 'Nouvelle question'}
                          </Typography>
                          <Chip 
                            label={questionTypes.find(t => t.value === question.type)?.label || 'Choix unique'} 
                            size="small" 
                            sx={{ ml: 1 }}
                          />
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                          <Tooltip title="Déplacer vers le haut">
                            <span>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveQuestionUp(index);
                                }}
                                disabled={index === 0}
                              >
                                <ArrowUpwardIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Déplacer vers le bas">
                            <span>
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveQuestionDown(index);
                                }}
                                disabled={index === qcmData.questions.length - 1}
                              >
                                <ArrowDownwardIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Dupliquer">
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateQuestion(index);
                              }}
                            >
                              <FileCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Supprimer">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveQuestion(index);
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                  
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<AddIcon />}
                    onClick={handleAddQuestion}
                    sx={{ mt: 2 }}
                  >
                    Ajouter une question
                  </Button>
                </Paper>
              </Grid>
              
              {/* Édition de la question courante */}
              <Grid item xs={12} md={8}>
                {qcmData.questions.length > 0 && (
                  <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Question {currentQuestionIndex + 1}
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          label="Énoncé de la question"
                          value={qcmData.questions[currentQuestionIndex].text}
                          onChange={(e) => handleQuestionChange(currentQuestionIndex, 'text', e.target.value)}
                          multiline
                          rows={2}
                          fullWidth
                          required
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Type de question</InputLabel>
                          <Select
                            value={qcmData.questions[currentQuestionIndex].type}
                            onChange={(e) => handleQuestionChange(currentQuestionIndex, 'type', e.target.value)}
                            label="Type de question"
                          >
                            {questionTypes.map((type) => (
                              <MenuItem key={type.value} value={type.value}>
                                {type.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Points"
                          type="number"
                          value={qcmData.questions[currentQuestionIndex].points}
                          onChange={(e) => handleQuestionChange(currentQuestionIndex, 'points', parseInt(e.target.value))}
                          fullWidth
                          InputProps={{ inputProps: { min: 1 } }}
                          helperText="Nombre de points attribués à cette question"
                        />
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Options de réponse
                        </Typography>
                        
                        {qcmData.questions[currentQuestionIndex].type === 'true_false' ? (
                          // Cas spécial pour les questions Vrai/Faux
                          <FormControl component="fieldset">
                            <RadioGroup
                              value={qcmData.questions[currentQuestionIndex].options.findIndex(opt => opt.isCorrect) === 0 ? 'true' : 'false'}
                              onChange={(e) => {
                                const newOptions = [
                                  { id: 1, text: 'Vrai', isCorrect: e.target.value === 'true' },
                                  { id: 2, text: 'Faux', isCorrect: e.target.value === 'false' }
                                ];
                                handleQuestionChange(currentQuestionIndex, 'options', newOptions);
                              }}
                            >
                              <FormControlLabel value="true" control={<Radio />} label="Vrai est la réponse correcte" />
                              <FormControlLabel value="false" control={<Radio />} label="Faux est la réponse correcte" />
                            </RadioGroup>
                          </FormControl>
                        ) : (
                          // Interface standard pour les autres types de questions
                          <Box>
                            {qcmData.questions[currentQuestionIndex].options.map((option, optIndex) => (
                              <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                {qcmData.questions[currentQuestionIndex].type === 'single' ? (
                                  <Radio
                                    checked={option.isCorrect}
                                    onChange={() => handleOptionChange(currentQuestionIndex, optIndex, 'isCorrect', true)}
                                  />
                                ) : (
                                  <Checkbox
                                    checked={option.isCorrect}
                                    onChange={(e) => handleOptionChange(currentQuestionIndex, optIndex, 'isCorrect', e.target.checked)}
                                  />
                                )}
                                <TextField
                                  value={option.text}
                                  onChange={(e) => handleOptionChange(currentQuestionIndex, optIndex, 'text', e.target.value)}
                                  fullWidth
                                  placeholder={`Option ${optIndex + 1}`}
                                  size="small"
                                  sx={{ mr: 1 }}
                                />
                                <IconButton 
                                  color="error" 
                                  onClick={() => handleRemoveOption(currentQuestionIndex, optIndex)}
                                  disabled={qcmData.questions[currentQuestionIndex].options.length <= 2}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            ))}
                            
                            <Button 
                              startIcon={<AddIcon />}
                              onClick={() => handleAddOption(currentQuestionIndex)}
                              variant="outlined"
                              size="small"
                              sx={{ mt: 1 }}
                            >
                              Ajouter une option
                            </Button>
                          </Box>
                        )}
                      </Grid>
                      
                      <Grid item xs={12}>
                        <TextField
                          label="Explication (optionnelle)"
                          value={qcmData.questions[currentQuestionIndex].explanation}
                          onChange={(e) => handleQuestionChange(currentQuestionIndex, 'explanation', e.target.value)}
                          multiline
                          rows={2}
                          fullWidth
                          helperText="Cette explication sera montrée après que l'étudiant ait répondu"
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                )}
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack}>
                  Retour
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ 
                    bgcolor: '#ff9900', 
                    '&:hover': { bgcolor: '#e68a00' } 
                  }}
                >
                  Suivant
                </Button>
              </Grid>
            </Grid>
          )}
          
          {/* Étape 3: Paramètres et aperçu */}
          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Paramètres du QCM
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={qcmData.showCorrectAnswers}
                        onChange={handleSwitchChange}
                        name="showCorrectAnswers"
                        color="primary"
                      />
                    }
                    label="Montrer les réponses correctes après soumission"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={qcmData.isPublished}
                        onChange={handleSwitchChange}
                        name="isPublished"
                        color="primary"
                      />
                    }
                    label="Publier immédiatement après la création"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      <strong>Rappel:</strong> Assurez-vous que vos questions et réponses sont claires et précises. Les étudiants doivent pouvoir comprendre ce qui est demandé sans ambiguïté.
                    </Typography>
                  </Alert>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Récapitulatif
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Titre:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {qcmData.title || "(Non défini)"}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Cours associé:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {mockCourses.find(c => c.id === parseInt(qcmData.courseId))?.title || "(Non défini)"}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Nombre de questions:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {qcmData.questions.length}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Score minimal requis:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {qcmData.passingScore}%
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Limite de temps:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {qcmData.timeLimit > 0 ? `${qcmData.timeLimit} minutes` : "Aucune limite"}
                    </Typography>
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Total des points:
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      {qcmData.questions.reduce((sum, q) => sum + (q.points || 1), 0)} points
                    </Typography>
                    
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        icon={qcmData.isPublished ? <CheckCircleIcon /> : <VisibilityIcon />}
                        label={qcmData.isPublished ? "Sera publié" : "Brouillon"} 
                        color={qcmData.isPublished ? "success" : "default"}
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Aperçu des questions
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  {qcmData.questions.map((question, qIndex) => (
                    <Card key={qIndex} variant="outlined" sx={{ mb: 2, borderColor: '#e0e0e0' }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Question {qIndex + 1} ({question.points} pt{question.points > 1 ? 's' : ''})
                          </Typography>
                          <Chip 
                            label={questionTypes.find(t => t.value === question.type)?.label || 'Choix unique'} 
                            size="small" 
                          />
                        </Box>
                        
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {question.text || "(Énoncé de la question)"}
                        </Typography>
                        
                        <Box sx={{ pl: 2 }}>
                          {question.options.map((option, oIndex) => (
                            <Box key={oIndex} sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                              {question.type === 'single' ? (
                                <Radio 
                                  checked={false} 
                                  disabled 
                                  size="small"
                                  sx={{ color: option.isCorrect ? 'success.main' : 'inherit' }}
                                />
                              ) : (
                                <Checkbox 
                                  checked={false} 
                                  disabled 
                                  size="small"
                                  sx={{ color: option.isCorrect ? 'success.main' : 'inherit' }}
                                />
                              )}
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  color: option.isCorrect ? 'success.main' : 'inherit',
                                  fontWeight: option.isCorrect ? 'bold' : 'normal'
                                }}
                              >
                                {option.text || `(Option ${oIndex + 1})`}
                                {option.isCorrect && " ✓"}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        
                        {question.explanation && (
                          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(33, 150, 243, 0.1)', borderRadius: 1 }}>
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              Explication:
                            </Typography>
                            <Typography variant="body2">
                              {question.explanation}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Paper>
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack}>
                  Retour
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ 
                    bgcolor: '#ff9900', 
                    '&:hover': { bgcolor: '#e68a00' } 
                  }}
                >
                  {qcmData.isPublished ? 'Publier le QCM' : 'Enregistrer comme brouillon'}
                </Button>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
      
      {/* Boîte de dialogue d'aide */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Conseils pour créer un bon QCM</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Types de questions
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Choix unique</strong>: L'étudiant ne peut sélectionner qu'une seule réponse correcte.
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Choix multiple</strong>: L'étudiant peut sélectionner plusieurs réponses correctes.
          </Typography>
          <Typography variant="body2" paragraph>
            • <strong>Vrai/Faux</strong>: L'étudiant doit déterminer si l'affirmation est vraie ou fausse.
          </Typography>
          
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Bonnes pratiques
          </Typography>
          <Typography variant="body2">
            • Rédigez des questions claires et sans ambiguïté.
          </Typography>
          <Typography variant="body2">
            • Évitez les indices grammaticaux qui pourraient révéler la bonne réponse.
          </Typography>
          <Typography variant="body2">
            • Pour les questions à choix multiples, assurez-vous que les mauvaises réponses sont plausibles.
          </Typography>
          <Typography variant="body2">
            • Utilisez le champ d'explication pour fournir un contexte ou des détails supplémentaires après la réponse.
          </Typography>
          <Typography variant="body2">
            • Pensez à varier la difficulté des questions pour évaluer différents niveaux de compréhension.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </TeacherLayout>
  );
};

export default CreateQCM;