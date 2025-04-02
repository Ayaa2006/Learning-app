// src/pages/CreateCourse.jsx
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
  Autocomplete,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardMedia,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Visibility as VisibilityIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatQuote as FormatQuoteIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import AdminLayout from '../components/layouts/TeacherLayout';
import { useAuth } from '../contexts/AuthContext';

// Données fictives des modules disponibles
const mockModules = [
  { id: 1, title: "Introduction à JavaScript", description: "Bases du langage JavaScript" },
  { id: 2, title: "JavaScript Avancé", description: "Concepts avancés JS: promesses, async/await" },
  { id: 3, title: "Frameworks Frontend", description: "React, Vue.js, Angular" },
  { id: 4, title: "Développement Backend", description: "Node.js, Express" },
  { id: 5, title: "Bases de Données", description: "SQL, MongoDB" }
];

// Liste prédéfinie de compétences pour les tags
const skillTags = [
  "JavaScript", "HTML", "CSS", "React", "Vue.js", "Angular", "Node.js", 
  "Express", "MongoDB", "SQL", "API REST", "Frontend", "Backend", 
  "Full Stack", "Sécurité", "Performance", "Responsive", "UX/UI", "Design"
];

const CreateCourse = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState({ show: false, message: '', type: 'info' });
  
  // États du formulaire
  const [courseData, setCourseData] = useState({
    title: '',
    moduleId: '',
    description: '',
    objectives: [''],
    duration: '',
    difficulty: 'intermediate',
    tags: [],
    prerequisites: '',
    isPublished: false,
    content: '',
    resources: [{ title: '', url: '', type: 'link' }]
  });
  
  // Pour téléchargement d'image (simulation)
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Vérifier les permissions
  useEffect(() => {
    if (!hasPermission('createCourse')) {
      navigate('/admin-courses');
    }
  }, [hasPermission, navigate]);
  
  // Étapes du stepper
  const steps = [
    'Informations de base',
    'Contenu du cours',
    'Ressources additionnelles',
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
      // Valider les informations de base
      if (!courseData.title || !courseData.moduleId || !courseData.description || !courseData.duration) {
        setSavingStatus({
          show: true,
          message: 'Veuillez remplir tous les champs obligatoires',
          type: 'error'
        });
        return false;
      }
    } else if (activeStep === 1) {
      // Valider le contenu
      if (!courseData.content || courseData.content.length < 50) {
        setSavingStatus({
          show: true,
          message: 'Le contenu du cours est trop court ou vide',
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
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Gérer les changements de tags
  const handleTagsChange = (event, newValue) => {
    setCourseData(prev => ({
      ...prev,
      tags: newValue
    }));
  };
  
  // Gérer l'ajout d'objectifs d'apprentissage
  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...courseData.objectives];
    newObjectives[index] = value;
    setCourseData(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };
  
  const handleAddObjective = () => {
    setCourseData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };
  
  const handleRemoveObjective = (index) => {
    const newObjectives = [...courseData.objectives];
    newObjectives.splice(index, 1);
    setCourseData(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };
  
  // Gérer l'ajout de ressources
  const handleResourceChange = (index, field, value) => {
    const newResources = [...courseData.resources];
    newResources[index] = { ...newResources[index], [field]: value };
    setCourseData(prev => ({
      ...prev,
      resources: newResources
    }));
  };
  
  const handleAddResource = () => {
    setCourseData(prev => ({
      ...prev,
      resources: [...prev.resources, { title: '', url: '', type: 'link' }]
    }));
  };
  
  const handleRemoveResource = (index) => {
    const newResources = [...courseData.resources];
    newResources.splice(index, 1);
    setCourseData(prev => ({
      ...prev,
      resources: newResources
    }));
  };
  
  // Gérer le téléchargement d'image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      // Créer une URL pour prévisualiser l'image
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
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
      message: 'Enregistrement du cours en cours...',
      type: 'info'
    });
    
    try {
      // Simuler une requête API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSavingStatus({
        show: true,
        message: 'Cours créé avec succès',
        type: 'success'
      });
      
      // Rediriger vers la liste des cours après un délai
      setTimeout(() => {
        navigate('/admin-courses');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la création du cours:', error);
      setSavingStatus({
        show: true,
        message: 'Erreur lors de la création du cours',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Prévisualiser le cours
  const handlePreview = () => {
    // Dans une implémentation réelle, vous pourriez ouvrir une modal ou une nouvelle page
    console.log('Prévisualisation du cours:', courseData);
    
    setSavingStatus({
      show: true,
      message: 'Fonctionnalité de prévisualisation à implémenter',
      type: 'info'
    });
  };
  
  return (
    <AdminLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
      <Box sx={{ py: 4, bgcolor: darkMode ? 'background.default' : '#f5f7fb', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          {/* En-tête */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton 
                onClick={() => navigate('/admin-courses')} 
                sx={{ mr: 2 }}
                color="inherit"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                Créer un nouveau cours
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
                {activeStep === steps.length - 1 ? 'Publier le cours' : 'Enregistrer'}
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
          
          {/* Étape 1: Informations de base */}
          {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Informations générales
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Titre du cours"
                        name="title"
                        value={courseData.title}
                        onChange={handleChange}
                        fullWidth
                        required
                        helperText="Soyez concis et descriptif (max 60 caractères)"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Module</InputLabel>
                        <Select
                          name="moduleId"
                          value={courseData.moduleId}
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
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Durée estimée (minutes)"
                        name="duration"
                        value={courseData.duration}
                        onChange={handleChange}
                        type="number"
                        InputProps={{ inputProps: { min: 5, max: 300 } }}
                        fullWidth
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Niveau de difficulté</InputLabel>
                        <Select
                          name="difficulty"
                          value={courseData.difficulty}
                          onChange={handleChange}
                          label="Niveau de difficulté"
                        >
                          <MenuItem value="beginner">Débutant</MenuItem>
                          <MenuItem value="intermediate">Intermédiaire</MenuItem>
                          <MenuItem value="advanced">Avancé</MenuItem>
                          <MenuItem value="expert">Expert</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        name="description"
                        value={courseData.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        required
                        helperText="Décrivez le contenu et les objectifs du cours (max 500 caractères)"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Autocomplete
                        multiple
                        options={skillTags}
                        value={courseData.tags}
                        onChange={handleTagsChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tags et compétences"
                            placeholder="Ajouter un tag"
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              label={option}
                              {...getTagProps({ index })}
                              sx={{ bgcolor: '#ff99004d', color: '#e68a00' }}
                            />
                          ))
                        }
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Prérequis"
                        name="prerequisites"
                        value={courseData.prerequisites}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        fullWidth
                        helperText="Connaissance ou compétences requises pour suivre ce cours"
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Image de couverture
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ textAlign: 'center' }}>
                    {previewImage ? (
                      <Box>
                        <img 
                          src={previewImage} 
                          alt="Aperçu" 
                          style={{ 
                            width: '100%', 
                            borderRadius: '8px',
                            marginBottom: '16px',
                            maxHeight: '200px',
                            objectFit: 'cover'
                          }} 
                        />
                        <Button 
                          variant="outlined" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => {
                            setCoverImage(null);
                            setPreviewImage(null);
                          }}
                          fullWidth
                        >
                          Supprimer
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ 
                        border: '2px dashed #ccc', 
                        borderRadius: '8px',
                        p: 5,
                        textAlign: 'center',
                        bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        cursor: 'pointer'
                      }}>
                        <input
                          accept="image/*"
                          style={{ display: 'none' }}
                          id="cover-image-upload"
                          type="file"
                          onChange={handleImageUpload}
                        />
                        <label htmlFor="cover-image-upload">
                          <Box>
                            <CloudUploadIcon fontSize="large" sx={{ mb: 1, color: '#aaa' }} />
                            <Typography variant="body1" gutterBottom>
                              Déposer une image ou cliquer pour parcourir
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              JPG, PNG ou GIF - Max 2MB
                            </Typography>
                          </Box>
                        </label>
                      </Box>
                    )}
                  </Box>
                </Paper>
                
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Objectifs d'apprentissage
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  {courseData.objectives.map((objective, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                      <TextField
                        value={objective}
                        onChange={(e) => handleObjectiveChange(index, e.target.value)}
                        fullWidth
                        placeholder={`Objectif ${index + 1}`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveObjective(index)}
                        disabled={courseData.objectives.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  
                  <Button 
                    startIcon={<AddIcon />}
                    onClick={handleAddObjective}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Ajouter un objectif
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
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
          
          {/* Étape 2: Contenu du cours */}
          {activeStep === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Contenu du cours
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  {/* Barre d'outils d'édition */}
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Tooltip title="Gras">
                      <IconButton size="small" sx={{ border: '1px solid #ddd' }}>
                        <FormatBoldIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Italique">
                      <IconButton size="small" sx={{ border: '1px solid #ddd' }}>
                        <FormatItalicIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Liste à puces">
                      <IconButton size="small" sx={{ border: '1px solid #ddd' }}>
                        <FormatListBulletedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Liste numérotée">
                      <IconButton size="small" sx={{ border: '1px solid #ddd' }}>
                        <FormatListNumberedIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Citation">
                      <IconButton size="small" sx={{ border: '1px solid #ddd' }}>
                        <FormatQuoteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Insérer une image">
                      <IconButton size="small" sx={{ border: '1px solid #ddd' }}>
                        <ImageIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  
                  <TextField
                    name="content"
                    value={courseData.content}
                    onChange={handleChange}
                    multiline
                    rows={15}
                    fullWidth
                    placeholder="Écrivez le contenu du cours ici..."
                    variant="outlined"
                    required
                  />
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Vous pouvez utiliser le formatage Markdown pour structurer votre contenu.
                  </Typography>
                </Paper>
                
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
              </Grid>
            </Grid>
          )}
          
          {/* Étape 3: Ressources additionnelles */}
          {activeStep === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Ressources additionnelles
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Ajoutez des ressources complémentaires pour aider les étudiants à approfondir leurs connaissances.
                  </Typography>
                  
                  {courseData.resources.map((resource, index) => (
                    <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            label="Titre de la ressource"
                            value={resource.title}
                            onChange={(e) => handleResourceChange(index, 'title', e.target.value)}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            label="URL ou référence"
                            value={resource.url}
                            onChange={(e) => handleResourceChange(index, 'url', e.target.value)}
                            fullWidth
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <FormControl fullWidth size="small">
                            <InputLabel>Type</InputLabel>
                            <Select
                              value={resource.type}
                              onChange={(e) => handleResourceChange(index, 'type', e.target.value)}
                              label="Type"
                            >
                              <MenuItem value="link">Lien</MenuItem>
                              <MenuItem value="document">Document</MenuItem>
                              <MenuItem value="video">Vidéo</MenuItem>
                              <MenuItem value="article">Article</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <IconButton 
                            color="error" 
                            onClick={() => handleRemoveResource(index)}
                            disabled={courseData.resources.length <= 1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Box>
                  ))}
                  
                  <Button 
                    startIcon={<AddIcon />}
                    onClick={handleAddResource}
                    sx={{ mt: 1 }}
                  >
                    Ajouter une ressource
                  </Button>
                </Paper>
                
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
              </Grid>
            </Grid>
          )}
          
          {/* Étape 4: Aperçu et publication */}
          {activeStep === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Aperçu et publication
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ mb: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={courseData.isPublished}
                          onChange={(e) => setCourseData(prev => ({ ...prev, isPublished: e.target.checked }))}
                          color="primary"
                        />
                      }
                      label="Publier immédiatement après la création"
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      Si cette option est désactivée, le cours sera enregistré comme brouillon et ne sera pas visible par les étudiants.
                    </Typography>
                  </Box>
                  
                  <Card sx={{ mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={previewImage || "https://via.placeholder.com/800x400?text=Image+de+couverture"}
                        alt="Aperçu du cours"
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          color: 'white',
                          padding: '10px',
                        }}
                      >
                        <Typography variant="h5" component="div">
                          {courseData.title || "Titre du cours"}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={`${courseData.duration || 0} min`} 
                            size="small" 
                            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} 
                          />
                          <Chip 
                            label={courseData.difficulty === 'beginner' ? 'Débutant' : 
                                   courseData.difficulty === 'intermediate' ? 'Intermédiaire' : 
                                   courseData.difficulty === 'advanced' ? 'Avancé' : 'Expert'} 
                            size="small" 
                            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} 
                          />
                        </Box>
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {courseData.description || "Description du cours..."}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Module:
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {mockModules.find(m => m.id === parseInt(courseData.moduleId))?.title || "Non spécifié"}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Objectifs d'apprentissage:
                      </Typography>
                      <ul>
                        {courseData.objectives.filter(obj => obj.trim()).map((objective, index) => (
                          <li key={index}>
                            <Typography variant="body2">{objective}</Typography>
                          </li>
                        ))}
                      </ul>
                      
                      {courseData.tags.length > 0 && (
                        <>
                          <Typography variant="subtitle2" gutterBottom>
                            Compétences:
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {courseData.tags.map((tag, index) => (
                              <Chip 
                                key={index} 
                                label={tag} 
                                size="small" 
                                sx={{ mt: 0.5, bgcolor: '#ff99004d', color: '#e68a00' }} 
                              />
                            ))}
                          </Stack>
                        </>
                      )}
                      
                      {courseData.resources.filter(r => r.title && r.url).length > 0 && (
                        <>
                          <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                            Ressources:
                          </Typography>
                          <ul>
                            {courseData.resources.filter(r => r.title && r.url).map((resource, index) => (
                              <li key={index}>
                                <Typography variant="body2">
                                  {resource.title} ({resource.type})
                                </Typography>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        <Chip 
                          icon={courseData.isPublished ? <CheckCircleIcon /> : <VisibilityIcon />}
                          label={courseData.isPublished ? "Sera publié" : "Brouillon"} 
                          color={courseData.isPublished ? "success" : "default"}
                          variant="outlined"
                        />
                      </Box>
                    </CardContent>
                  </Card>
                  
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Rappel:</strong> Assurez-vous que le contenu respecte les standards de qualité et n'enfreint aucun droit d'auteur.
                    </Typography>
                  </Alert>
                </Paper>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
                    {courseData.isPublished ? 'Publier le cours' : 'Enregistrer comme brouillon'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default CreateCourse;