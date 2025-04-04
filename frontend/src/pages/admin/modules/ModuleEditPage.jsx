// pages/admin/modules/ModuleEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { fetchModuleById, updateModule } from '../../../services/moduleService';

const ModuleEditPage = () => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: '',
    status: 'draft',
    duration: '0',
    minimumPassingScore: '70'
  });
  
  // État pour la validation
  const [errors, setErrors] = useState({});
  
  // État pour le chargement et la soumission
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  
  // Charger les données du module
  useEffect(() => {
    const loadModule = async () => {
      try {
        setLoading(true);
        const moduleData = await fetchModuleById(moduleId);
        
        setFormData({
          title: moduleData.title,
          description: moduleData.description,
          order: moduleData.order.toString(),
          status: moduleData.status,
          duration: moduleData.duration.toString(),
          minimumPassingScore: moduleData.minimumPassingScore.toString()
        });
        
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement du module: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    };
    
    loadModule();
  }, [moduleId]);
  
  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Fonction pour valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.order) {
      newErrors.order = 'L\'ordre est requis';
    } else if (isNaN(Number(formData.order)) || Number(formData.order) < 1) {
      newErrors.order = 'L\'ordre doit être un nombre positif';
    }
    
    if (!formData.duration) {
      newErrors.duration = 'La durée est requise';
    } else if (isNaN(Number(formData.duration)) || Number(formData.duration) < 0) {
      newErrors.duration = 'La durée doit être un nombre positif';
    }
    
    if (!formData.minimumPassingScore) {
      newErrors.minimumPassingScore = 'Le score minimum est requis';
    } else if (
      isNaN(Number(formData.minimumPassingScore)) || 
      Number(formData.minimumPassingScore) < 0 || 
      Number(formData.minimumPassingScore) > 100
    ) {
      newErrors.minimumPassingScore = 'Le score minimum doit être un nombre entre 0 et 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Préparer les données
      const moduleData = {
        ...formData,
        order: Number(formData.order),
        duration: Number(formData.duration),
        minimumPassingScore: Number(formData.minimumPassingScore)
      };
      
      // Envoyer la requête
      const updatedModule = await updateModule(moduleId, moduleData);
      
      // Rediriger vers la page de détails du module
      navigate(`/admin/modules/${moduleId}`, {
        state: {
          alert: {
            type: 'success',
            message: `Le module "${updatedModule.title}" a été mis à jour avec succès.`
          }
        }
      });
    } catch (err) {
      console.error('Error updating module:', err);
      
      setSubmitError(
        err.response?.data?.message || 
        'Une erreur est survenue lors de la mise à jour du module.'
      );
      
      // Vérifier s'il y a des erreurs de validation côté serveur
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fonction pour annuler
  const handleCancel = () => {
    navigate(`/admin/modules/${moduleId}`);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ my: 3 }}>
          {error}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/modules')}
        >
          Retour à la liste des modules
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={handleCancel}
              sx={{ mr: 2 }}
            >
              Retour
            </Button>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h1">
              Modifier le module
            </Typography>
          </Grid>
        </Grid>
      </Box>
      
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Informations générales
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Titre du module"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Ordre d'affichage"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleChange}
                  error={!!errors.order}
                  helperText={errors.order}
                  InputProps={{ inputProps: { min: 1 } }}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!errors.description}
                  helperText={errors.description}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel id="status-label">Statut</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    label="Statut"
                  >
                    <MenuItem value="draft">Brouillon</MenuItem>
                    <MenuItem value="published">Publié</MenuItem>
                    <MenuItem value="archived">Archivé</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Durée estimée (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  error={!!errors.duration}
                  helperText={errors.duration}
                  InputProps={{ 
                    inputProps: { min: 0 },
                    endAdornment: <InputAdornment position="end">min</InputAdornment>
                  }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Score minimum requis (%)"
                  name="minimumPassingScore"
                  type="number"
                  value={formData.minimumPassingScore}
                  onChange={handleChange}
                  error={!!errors.minimumPassingScore}
                  helperText={errors.minimumPassingScore}
                  InputProps={{ 
                    inputProps: { min: 0, max: 100 },
                    endAdornment: <InputAdornment position="end">%</InputAdornment>
                  }}
                  required
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ModuleEditPage;