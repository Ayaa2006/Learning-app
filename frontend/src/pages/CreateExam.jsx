// src/pages/CreateExam.jsx
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Radio,
  RadioGroup,
  Checkbox,
  FormGroup,
  LinearProgress,
  ListItemIcon,
  List,
  ListItem,
  ListItemText
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
  ExpandMore as ExpandMoreIcon,
  Shuffle as ShuffleIcon,
  Timer as TimerIcon,
  Videocam as VideocamIcon,
  Alarm as AlarmIcon,
  Warning as WarningIcon,
  Announcement as AnnouncementIcon,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Lock as LockIcon,
  Group as GroupIcon,
  Computer as ComputerIcon,
  PhoneAndroid as PhoneAndroidIcon,
  DesktopMac as DesktopMacIcon,
  TabletAndroid as TabletAndroidIcon
} from '@mui/icons-material';
import AdminLayout from '../components/layouts/TeacherLayout';
import { useAuth } from '../contexts/AuthContext';
import TeacherLayout from '../components/layouts/TeacherLayout';

// Données fictives des modules disponibles
const mockModules = [
  { id: 1, title: "Introduction à JavaScript" },
  { id: 2, title: "JavaScript Avancé" },
  { id: 3, title: "Frameworks Frontend" },
  { id: 4, title: "Développement Backend" },
  { id: 5, title: "Bases de Données" }
];

// Questions existantes pour importer
const existingQuestions = [
  { 
    id: 1, 
    text: "Quel type de variable est utilisé pour stocker des nombres entiers en JavaScript?", 
    type: "single",
    options: [
      { id: 1, text: "String", isCorrect: false },
      { id: 2, text: "Float", isCorrect: false },
      { id: 3, text: "Number", isCorrect: true },
      { id: 4, text: "Integer", isCorrect: false }
    ]
  },
  { 
    id: 2, 
    text: "Quelles sont les méthodes pour déclarer une variable en JavaScript?", 
    type: "multiple",
    options: [
      { id: 1, text: "var", isCorrect: true },
      { id: 2, text: "let", isCorrect: true },
      { id: 3, text: "const", isCorrect: true },
      { id: 4, text: "function", isCorrect: false }
    ]
  },
  { 
    id: 3, 
    text: "Le code suivant va provoquer une erreur: const x = 1; x = 2;", 
    type: "true_false",
    options: [
      { id: 1, text: "Vrai", isCorrect: true },
      { id: 2, text: "Faux", isCorrect: false }
    ]
  }
];

// Types de détection de triche
const proctorOptions = [
  { value: 'face_detection', label: 'Détection de visage', icon: <VideocamIcon />, description: "Détecte si le visage de l'étudiant est visible pendant l'examen" },
  { value: 'multiple_faces', label: 'Détection de plusieurs visages', icon: <GroupIcon />, description: "Détecte la présence de plusieurs personnes à l'écran" },
  { value: 'window_detection', label: 'Détection de sortie de fenêtre', icon: <DesktopMacIcon />, description: "Détecte si l'étudiant quitte la fenêtre d'examen" },
  { value: 'browser_restriction', label: 'Restrictions du navigateur', icon: <LockIcon />, description: "Empêche l'ouverture de nouveaux onglets ou fenêtres" },
  { value: 'device_monitoring', label: 'Surveillance dappareils', icon: <ComputerIcon />, description: "Détecte l'utilisation d'appareils supplémentaires" }
];

const CreateExam = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState({ show: false, message: '', type: 'info' });
  const [importQuestionsDialog, setImportQuestionsDialog] = useState(false);
  
  // États du formulaire
  const [examData, setExamData] = useState({
    title: '',
    moduleId: '',
    description: '',
    duration: 60, // En minutes
    passingScore: 70, // Score en pourcentage pour réussir l'examen
    totalAttempts: 3, // Nombre de tentatives autorisées
    isPublished: false,
    shuffleQuestions: true,
    accessStartDate: '', // Date de début d'accès
    accessEndDate: '', // Date de fin d'accès
    proctor: {
      enabled: true,
      settings: {
        face_detection: true,
        multiple_faces: true,
        window_detection: true,
        browser_restriction: false,
        device_monitoring: false
      },
      tolerance: 5, // En secondes, durée de tolérance avant de signaler un incident
      warnings: true, // Avertissements avant de signaler l'incident
      warningsCount: 2, // Nombre d'avertissements
      consequence: 'fail', // 'fail', 'warning', 'terminate'
      recordSession: false, // Enregistrer la session
      requireWebcam: true, // Webcam obligatoire
      requireMicrophone: false // Microphone obligatoire
    },
    questions: [
      {
        text: '',
        type: 'single',
        points: 1,
        options: [
          { id: 1, text: '', isCorrect: false },
          { id: 2, text: '', isCorrect: false }
        ]
      }
    ],
    instructions: "Veuillez répondre à toutes les questions. Assurez-vous que votre webcam est activée durant toute la durée de l'examen.",
    resources: [] // Documents ou ressources autorisés pendant l'examen
  });
  
  // État pour les questions à importer
  const [questionsToImport, setQuestionsToImport] = useState([]);
  
  // Vérifier les permissions
  useEffect(() => {
    if (!hasPermission('createExam')) {
      navigate('/admin-exams');
    }
  }, [hasPermission, navigate]);
  
  // Étapes du stepper
  const steps = [
    'Informations générales',
    'Questions d\'examen',
    'Paramètres de surveillance',
    'Instructions et ressources',
    'Aperçu et publication'
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
      if (!examData.title || !examData.moduleId || !examData.duration) {
        setSavingStatus({
          show: true,
          message: 'Veuillez remplir tous les champs obligatoires',
          type: 'error'
        });
        return false;
      }
    } else if (activeStep === 1) {
      // Valider les questions
      const invalidQuestions = examData.questions.filter(q => 
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
      const noCorrectAnswer = examData.questions.some(q => 
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
  
  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer les changements de switch/checkbox
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Gérer les changements dans les paramètres de surveillance
  const handleProctorChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'enabled') {
      setExamData(prev => ({
        ...prev,
        proctor: {
          ...prev.proctor,
          enabled: checked
        }
      }));
    } else {
      setExamData(prev => ({
        ...prev,
        proctor: {
          ...prev.proctor,
          settings: {
            ...prev.proctor.settings,
            [name]: checked
          }
        }
      }));
    }
  };
  
  // Gérer les changements dans les paramètres de surveillance (valeurs)
  const handleProctorValueChange = (e) => {
    const { name, value } = e.target;
    
    setExamData(prev => ({
      ...prev,
      proctor: {
        ...prev.proctor,
        [name]: value
      }
    }));
  };
  
  // Gérer le changement de conséquence de triche
  const handleConsequenceChange = (e) => {
    setExamData(prev => ({
      ...prev,
      proctor: {
        ...prev.proctor,
        consequence: e.target.value
      }
    }));
  };
  
  // Gérer les changements dans une question
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...examData.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    
    setExamData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Gérer les changements dans une option de question
  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...examData.questions];
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
    
    setExamData(prev => ({
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
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    };
    
    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };
  
  // Supprimer une question
  const handleRemoveQuestion = (index) => {
    if (examData.questions.length <= 1) {
      setSavingStatus({
        show: true,
        message: 'Un examen doit contenir au moins une question',
        type: 'error'
      });
      return;
    }
    
    const updatedQuestions = [...examData.questions];
    updatedQuestions.splice(index, 1);
    
    setExamData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Ajouter une option à une question
  const handleAddOption = (questionIndex) => {
    const updatedQuestions = [...examData.questions];
    const options = [...updatedQuestions[questionIndex].options];
    
    // Trouver le plus grand ID existant et ajouter 1
    const maxId = Math.max(...options.map(opt => opt.id), 0);
    options.push({ id: maxId + 1, text: '', isCorrect: false });
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    
    setExamData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Supprimer une option
  const handleRemoveOption = (questionIndex, optionIndex) => {
    const question = examData.questions[questionIndex];
    
    if (question.options.length <= 2) {
      setSavingStatus({
        show: true,
        message: 'Une question doit avoir au moins deux options',
        type: 'error'
      });
      return;
    }
    
    const updatedQuestions = [...examData.questions];
    const options = [...updatedQuestions[questionIndex].options];
    options.splice(optionIndex, 1);
    
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      options
    };
    
    setExamData(prev => ({
      ...prev,
      questions: updatedQuestions
    }));
  };
  
  // Importer des questions
  const handleImportQuestions = () => {
    if (questionsToImport.length === 0) {
      setSavingStatus({
        show: true,
        message: 'Aucune question sélectionnée pour l\'importation',
        type: 'warning'
      });
      return;
    }
    
    // Récupérer les questions sélectionnées
    const questionsToAdd = existingQuestions.filter(q => 
      questionsToImport.includes(q.id)
    );
    
    // Ajouter les questions à l'examen
    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, ...questionsToAdd]
    }));
    
    // Réinitialiser la sélection
    setQuestionsToImport([]);
    setImportQuestionsDialog(false);
    
    setSavingStatus({
      show: true,
      message: `${questionsToAdd.length} question(s) importée(s) avec succès`,
      type: 'success'
    });
  };
  
  // Gérer la sélection des questions à importer
  const handleToggleImportQuestion = (questionId) => {
    if (questionsToImport.includes(questionId)) {
      setQuestionsToImport(prev => prev.filter(id => id !== questionId));
    } else {
      setQuestionsToImport(prev => [...prev, questionId]);
    }
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
      message: 'Enregistrement de l\'examen en cours...',
      type: 'info'
    });
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSavingStatus({
        show: true,
        message: 'Examen créé avec succès',
        type: 'success'
      });
      
      // Rediriger vers la liste des examens après un délai
      setTimeout(() => {
        navigate('/admin-exams');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la création de l\'examen:', error);
      setSavingStatus({
        show: true,
        message: 'Erreur lors de la création de l\'examen',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Calculer le score total possible
  const calculateTotalPoints = () => {
    return examData.questions.reduce((total, question) => total + (question.points || 1), 0);
  };
  
  // Calculer le nombre de points de passage
  const calculatePassingPoints = () => {
    return Math.ceil((calculateTotalPoints() * examData.passingScore) / 100);
  };
  
  // Prévisualiser l'examen
  const handlePreview = () => {
    // Dans une implémentation réelle, vous pourriez ouvrir une modal ou une nouvelle page
    console.log('Prévisualisation de l\'examen:', examData);
    
    setSavingStatus({
      show: true,
      message: 'Fonctionnalité de prévisualisation à implémenter',
      type: 'info'
    });
  };
  
  // Changement d'onglet dans l'édition des questions
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <TeacherLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
      <Box sx={{ py: 4, bgcolor: darkMode ? 'background.default' : '#f5f7fb', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => navigate('/admin-exams')} 
                sx={{ mr: 2 }}
                color="inherit"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Créer un nouvel examen
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
                {activeStep === steps.length - 1 ? 'Publier l\'examen' : 'Enregistrer'}
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
                Informations générales de l'examen
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Titre de l'examen"
                    name="title"
                    value={examData.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    helperText="Titre clair et descriptif de l'examen"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Module</InputLabel>
                    <Select
                      name="moduleId"
                      value={examData.moduleId}
                      onChange={handleChange}
                      label="Module"
                    >
                      {mockModules.map((module) => (
                        <MenuItem key={module.id} value={module.id}>
                          {module.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Durée (minutes)"
                    name="duration"
                    type="number"
                    value={examData.duration}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 5 } }}
                    helperText="Durée de l'examen en minutes"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Score minimal pour réussir (%)"
                    name="passingScore"
                    type="number"
                    value={examData.passingScore}
                    onChange={handleChange}
                    fullWidth
                    required
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                    helperText="Pourcentage minimal requis pour valider l'examen"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre de tentatives autorisées"
                    name="totalAttempts"
                    type="number"
                    value={examData.totalAttempts}
                    onChange={handleChange}
                    fullWidth
                    InputProps={{ inputProps: { min: 1 } }}
                    helperText="Nombre maximum de tentatives par étudiant"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date de début d'accès"
                    name="accessStartDate"
                    type="datetime-local"
                    value={examData.accessStartDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    helperText="Date à partir de laquelle l'examen sera accessible"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date de fin d'accès"
                    name="accessEndDate"
                    type="datetime-local"
                    value={examData.accessEndDate}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    helperText="Date après laquelle l'examen ne sera plus accessible"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={examData.shuffleQuestions}
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
                    value={examData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                    helperText="Description du contenu et des objectifs de l'examen"
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
          
          {/* Étape 2: Questions d'examen */}
          {activeStep === 1 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Questions d'examen
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Box sx={{ mb: 3 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="fullWidth" 
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Édition des questions" />
                  <Tab label="Aperçu des questions" />
                </Tabs>
              </Box>
              
              {/* Mode édition des questions */}
              {tabValue === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="subtitle1">
                      {examData.questions.length} question(s) • {calculateTotalPoints()} points au total
                    </Typography>
                    <Box>
                      <Button 
                        variant="outlined" 
                        startIcon={<AddIcon />}
                        onClick={handleAddQuestion}
                        sx={{ mr: 1 }}
                      >
                        Nouvelle question
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<FileCopyIcon />}
                        onClick={() => setImportQuestionsDialog(true)}
                      >
                        Importer des questions
                      </Button>
                    </Box>
                  </Box>
                  
                  {examData.questions.map((question, qIndex) => (
                    <Accordion key={qIndex} sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                          <Typography>
                            <strong>Question {qIndex + 1}</strong>
                            {question.text ? ` - ${question.text.substring(0, 50)}${question.text.length > 50 ? '...' : ''}` : ' (Sans titre)'}
                          </Typography>
                          <Chip 
                            label={`${question.points} pt${question.points > 1 ? 's' : ''}`} 
                            size="small" 
                            sx={{ ml: 2 }}
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              label="Énoncé de la question"
                              value={question.text}
                              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
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
                                value={question.type}
                                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                                label="Type de question"
                              >
                                <MenuItem value="single">Choix unique</MenuItem>
                                <MenuItem value="multiple">Choix multiple</MenuItem>
                                <MenuItem value="true_false">Vrai/Faux</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <TextField
                              label="Points"
                              type="number"
                              value={question.points}
                              onChange={(e) => handleQuestionChange(qIndex, 'points', parseInt(e.target.value))}
                              fullWidth
                              InputProps={{ inputProps: { min: 1 } }}
                            />
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                              Options de réponse
                            </Typography>
                            
                            {question.type === 'true_false' ? (
                              // Cas spécial pour les questions Vrai/Faux
                              <FormControl component="fieldset">
                                <RadioGroup
                                  value={question.options.findIndex(opt => opt.isCorrect) === 0 ? 'true' : 'false'}
                                  onChange={(e) => {
                                    const newOptions = [
                                      { id: 1, text: 'Vrai', isCorrect: e.target.value === 'true' },
                                      { id: 2, text: 'Faux', isCorrect: e.target.value === 'false' }
                                    ];
                                    handleQuestionChange(qIndex, 'options', newOptions);
                                  }}
                                >
                                  <FormControlLabel value="true" control={<Radio />} label="Vrai est la réponse correcte" />
                                  <FormControlLabel value="false" control={<Radio />} label="Faux est la réponse correcte" />
                                </RadioGroup>
                              </FormControl>
                            ) : (
                              // Interface standard pour les autres types de questions
                              <Box>
                                {question.options.map((option, optIndex) => (
                                  <Box key={option.id} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    {question.type === 'single' ? (
                                      <Radio
                                        checked={option.isCorrect}
                                        onChange={() => handleOptionChange(qIndex, optIndex, 'isCorrect', true)}
                                      />
                                    ) : (
                                      <Checkbox
                                        checked={option.isCorrect}
                                        onChange={(e) => handleOptionChange(qIndex, optIndex, 'isCorrect', e.target.checked)}
                                      />
                                    )}
                                    <TextField
                                      value={option.text}
                                      onChange={(e) => handleOptionChange(qIndex, optIndex, 'text', e.target.value)}
                                      fullWidth
                                      placeholder={`Option ${optIndex + 1}`}
                                      size="small"
                                      sx={{ mr: 1 }}
                                    />
                                    <IconButton 
                                      color="error" 
                                      onClick={() => handleRemoveOption(qIndex, optIndex)}
                                      disabled={question.options.length <= 2}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                ))}
                                
                                <Button 
                                  startIcon={<AddIcon />}
                                  onClick={() => handleAddOption(qIndex)}
                                  variant="outlined"
                                  size="small"
                                  sx={{ mt: 1 }}
                                >
                                  Ajouter une option
                                </Button>
                              </Box>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Button 
                              color="error" 
                              startIcon={<DeleteIcon />}
                              onClick={() => handleRemoveQuestion(qIndex)}
                              disabled={examData.questions.length <= 1}
                            >
                              Supprimer cette question
                            </Button>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
              
              {/* Mode aperçu des questions */}
              {tabValue === 1 && (
                <Box>
                  {examData.questions.length === 0 ? (
                    <Alert severity="info">
                      Aucune question n'a été ajoutée à cet examen.
                    </Alert>
                  ) : (
                    <Box>
                      <Box sx={{ mb: 3 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                          Aperçu de l'examen tel qu'il sera présenté aux étudiants.
                        </Alert>
                        
                        <LinearProgress 
                          variant="determinate" 
                          value={100} 
                          sx={{ height: 10, borderRadius: 5, mb: 1 }} 
                        />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">
                            Questions: {examData.questions.length}
                          </Typography>
                          <Typography variant="body2">
                            Durée: {examData.duration} minutes
                          </Typography>
                          <Typography variant="body2">
                            Score minimal: {examData.passingScore}% ({calculatePassingPoints()} pts sur {calculateTotalPoints()} pts)
                          </Typography>
                        </Box>
                      </Box>
                      
                      {examData.questions.map((question, qIndex) => (
                        <Card key={qIndex} variant="outlined" sx={{ mb: 3 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h6" gutterBottom>
                                Question {qIndex + 1}
                              </Typography>
                              <Chip 
                                label={`${question.points} pt${question.points > 1 ? 's' : ''}`} 
                                size="small" 
                              />
                            </Box>
                            
                            <Typography variant="body1" sx={{ mb: 3 }}>
                              {question.text || "Énoncé de la question..."}
                            </Typography>
                            
                            {question.type === 'single' && (
                              <RadioGroup>
                                {question.options.map((option, oIndex) => (
                                  <FormControlLabel 
                                    key={option.id}
                                    value={option.id.toString()} 
                                    control={<Radio />} 
                                    label={option.text || `Option ${oIndex + 1}`} 
                                  />
                                ))}
                              </RadioGroup>
                            )}
                            
                            {question.type === 'multiple' && (
                              <FormGroup>
                                {question.options.map((option, oIndex) => (
                                  <FormControlLabel 
                                    key={option.id}
                                    control={<Checkbox />} 
                                    label={option.text || `Option ${oIndex + 1}`} 
                                  />
                                ))}
                              </FormGroup>
                            )}
                            
                            {question.type === 'true_false' && (
                              <RadioGroup>
                                <FormControlLabel value="true" control={<Radio />} label="Vrai" />
                                <FormControlLabel value="false" control={<Radio />} label="Faux" />
                              </RadioGroup>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
              </Box>
            </Paper>
          )}
          
          {/* Étape 3: Paramètres de surveillance */}
          {activeStep === 2 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Paramètres de surveillance (Proctoring)
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Les paramètres de surveillance permettent de garantir l'intégrité de l'examen en détectant les tentatives de triche.
              </Alert>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={examData.proctor.enabled}
                    onChange={handleProctorChange}
                    name="enabled"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="subtitle1" fontWeight="bold">
                    Activer la surveillance automatique
                  </Typography>
                }
                sx={{ mb: 2 }}
              />
              
              {examData.proctor.enabled && (
                <>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                    Types de détection
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {proctorOptions.map((option) => (
                      <Grid item xs={12} sm={6} key={option.value}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={examData.proctor.settings[option.value]}
                                  onChange={handleProctorChange}
                                  name={option.value}
                                  color="primary"
                                />
                              }
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {option.icon}
                                  <Typography variant="subtitle2" sx={{ ml: 1 }}>
                                    {option.label}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 8 }}>
                              {option.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                    Configuration de la surveillance
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Tolérance (secondes)"
                        name="tolerance"
                        type="number"
                        value={examData.proctor.tolerance}
                        onChange={(e) => handleProctorValueChange({
                          target: {
                            name: 'tolerance',
                            value: parseInt(e.target.value)
                          }
                        })}
                        fullWidth
                        InputProps={{ inputProps: { min: 1 } }}
                        helperText="Durée avant de signaler un incident (en secondes)"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Conséquence en cas de triche</InputLabel>
                        <Select
                          value={examData.proctor.consequence}
                          onChange={handleConsequenceChange}
                          label="Conséquence en cas de triche"
                        >
                          <MenuItem value="warning">Avertissement uniquement</MenuItem>
                          <MenuItem value="terminate">Terminer l'examen</MenuItem>
                          <MenuItem value="fail">Échec automatique</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={examData.proctor.warnings}
                            onChange={(e) => handleProctorValueChange({
                              target: {
                                name: 'warnings',
                                value: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Afficher des avertissements"
                      />
                      
                      {examData.proctor.warnings && (
                        <TextField
                          label="Nombre d'avertissements"
                          name="warningsCount"
                          type="number"
                          value={examData.proctor.warningsCount}
                          onChange={(e) => handleProctorValueChange({
                            target: {
                              name: 'warningsCount',
                              value: parseInt(e.target.value)
                            }
                          })}
                          fullWidth
                          sx={{ mt: 2 }}
                          InputProps={{ inputProps: { min: 1 } }}
                        />
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={examData.proctor.recordSession}
                            onChange={(e) => handleProctorValueChange({
                              target: {
                                name: 'recordSession',
                                value: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Enregistrer la session pour vérification"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={examData.proctor.requireWebcam}
                            onChange={(e) => handleProctorValueChange({
                              target: {
                                name: 'requireWebcam',
                                value: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Webcam obligatoire"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={examData.proctor.requireMicrophone}
                            onChange={(e) => handleProctorValueChange({
                              target: {
                                name: 'requireMicrophone',
                                value: e.target.checked
                              }
                            })}
                            color="primary"
                          />
                        }
                        label="Microphone obligatoire"
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
              </Box>
            </Paper>
          )}
          
          {/* Étape 4: Instructions et ressources */}
          {activeStep === 3 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Instructions et ressources
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Instructions pour les étudiants
              </Typography>
              <TextField
                name="instructions"
                value={examData.instructions}
                onChange={handleChange}
                multiline
                rows={6}
                fullWidth
                placeholder="Entrez les instructions qui seront affichées aux étudiants avant de commencer l'examen..."
                helperText="Incluez toutes les informations importantes concernant le déroulement de l'examen"
                sx={{ mb: 4 }}
              />
              
              <Typography variant="subtitle1" gutterBottom>
                Ressources autorisées pendant l'examen
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                Par défaut, aucune ressource externe n'est autorisée pendant l'examen. Vous pouvez ajouter des ressources spécifiques ci-dessous.
              </Alert>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Cette fonctionnalité permettra d'ajouter des documents de référence, des calculatrices ou d'autres ressources autorisées pendant l'examen.
                </Typography>
                
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  disabled
                >
                  Ajouter une ressource (Fonctionnalité à venir)
                </Button>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
              </Box>
            </Paper>
          )}
          
          {/* Étape 5: Aperçu et publication */}
          {activeStep === 4 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Aperçu et publication
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Vérifiez les informations de l'examen avant de le publier. Une fois publié, les étudiants pourront y accéder selon les dates définies.
              </Alert>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations générales
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Titre:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {examData.title || "(Non défini)"}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Module:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {mockModules.find(m => m.id === parseInt(examData.moduleId))?.title || "(Non défini)"}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Durée:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {examData.duration} minutes
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Score minimal requis:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {examData.passingScore}% ({calculatePassingPoints()} points sur {calculateTotalPoints()})
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Nombre de tentatives:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {examData.totalAttempts}
                      </Typography>
                      
                      {examData.accessStartDate && (
                        <>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date de début:
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {new Date(examData.accessStartDate).toLocaleString()}
                          </Typography>
                        </>
                      )}
                      
                      {examData.accessEndDate && (
                        <>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date de fin:
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {new Date(examData.accessEndDate).toLocaleString()}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Surveillance
                      </Typography>
                      
                      {examData.proctor.enabled ? (
                        <>
                          <Chip 
                            icon={<CheckCircleIcon />} 
                            label="Surveillance activée" 
                            color="success" 
                            variant="outlined" 
                            sx={{ mb: 2 }}
                          />
                          
                          <Typography variant="subtitle2" color="text.secondary">
                            Méthodes de détection:
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {Object.entries(examData.proctor.settings)
                              .filter(([_, enabled]) => enabled)
                              .map(([key]) => (
                                <Chip 
                                  key={key} 
                                  label={proctorOptions.find(opt => opt.value === key)?.label || key} 
                                  size="small" 
                                  sx={{ mr: 1, mb: 1 }} 
                                />
                              ))}
                          </Box>
                          
                          <Typography variant="subtitle2" color="text.secondary">
                            Conséquence en cas de triche:
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {examData.proctor.consequence === 'warning' ? 'Avertissement uniquement' :
                             examData.proctor.consequence === 'terminate' ? 'Terminer l\'examen' :
                             'Échec automatique'}
                          </Typography>
                          
                          <Typography variant="subtitle2" color="text.secondary">
                            Avertissements:
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            {examData.proctor.warnings ? `${examData.proctor.warningsCount} avertissements avant action` : 'Aucun avertissement'}
                          </Typography>
                        </>
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          La surveillance n'est pas activée pour cet examen.
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Questions
                      </Typography>
                      
                      <Typography variant="body1" sx={{ mb: 2 }}>
                        Cet examen contient {examData.questions.length} question(s) pour un total de {calculateTotalPoints()} points.
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        {examData.questions.map((q, index) => (
                          <Chip 
                            key={index}
                            label={`Q${index + 1}: ${q.points} pt${q.points > 1 ? 's' : ''}`}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                      
                      <Typography variant="subtitle2" color="text.secondary">
                        Ordre des questions:
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {examData.shuffleQuestions ? 'Aléatoire pour chaque étudiant' : 'Fixe pour tous les étudiants'}
                      </Typography>
                    </CardContent>
                  </Card>
                  
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Instructions
                      </Typography>
                      
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3 }}>
                        {examData.instructions || "Aucune instruction spécifique n'a été définie pour cet examen."}
                      </Typography>
                      
                      <Box sx={{ mt: 3 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={examData.isPublished}
                              onChange={handleSwitchChange}
                              name="isPublished"
                              color="primary"
                            />
                          }
                          label="Publier immédiatement après la création"
                        />
                        <Typography variant="caption" color="text.secondary" display="block">
                          Si cette option est désactivée, l'examen sera enregistré comme brouillon et ne sera pas visible par les étudiants.
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
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
                      {examData.isPublished ? 'Publier l\'examen' : 'Enregistrer comme brouillon'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Container>
      </Box>
      
      {/* Dialogue d'importation de questions */}
      <Dialog
        open={importQuestionsDialog}
        onClose={() => setImportQuestionsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Importer des questions existantes</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            Sélectionnez les questions que vous souhaitez importer dans cet examen. Vous pourrez les modifier après importation.
          </Typography>
          
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {existingQuestions.map((question) => (
              <ListItem 
                key={question.id}
                button
                onClick={() => handleToggleImportQuestion(question.id)}
                selected={questionsToImport.includes(question.id)}
                sx={{ 
                  mb: 1, 
                  border: '1px solid',
                  borderColor: questionsToImport.includes(question.id) ? '#ff9900' : '#e0e0e0',
                  borderRadius: 1,
                  bgcolor: questionsToImport.includes(question.id) ? '#fff9e6' : 'background.paper',
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={questionsToImport.includes(question.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={question.text}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        Type: {
                          question.type === 'single' ? 'Choix unique' : 
                          question.type === 'multiple' ? 'Choix multiple' : 
                          'Vrai/Faux'
                        }
                      </Typography>
                      <Typography variant="caption" display="block">
                        Options: {question.options.length} | Réponses correctes: {question.options.filter(opt => opt.isCorrect).length}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportQuestionsDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleImportQuestions}
            variant="contained"
            disabled={questionsToImport.length === 0}
            sx={{ 
              bgcolor: '#ff9900', 
              '&:hover': { bgcolor: '#e68a00' } 
            }}
          >
            Importer ({questionsToImport.length})
          </Button>
        </DialogActions>
      </Dialog>
    </TeacherLayout>
  );
};

export default CreateExam;