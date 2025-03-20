// pages/admin/modules/ModuleDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Chip,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  ArticleOutlined as ArticleIcon,
  AccessTime as AccessTimeIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { fetchModuleById, fetchModuleContents, fetchModuleStats } from '../../../services/moduleService';

// Composant pour afficher les informations du module
const ModuleInfoCard = ({ module }) => {
  // Fonction pour obtenir la couleur du chip de statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  // Fonction pour obtenir le texte du statut
  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Publié';
      case 'draft':
        return 'Brouillon';
      case 'archived':
        return 'Archivé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Informations du module</Typography>
          <Chip 
            label={getStatusText(module.status)} 
            color={getStatusColor(module.status)} 
          />
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Titre
            </Typography>
            <Typography variant="body1" paragraph>
              {module.title}
            </Typography>
            
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {module.description}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ArticleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Ordre d'affichage" 
                  secondary={module.order}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <AccessTimeIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Durée estimée" 
                  secondary={`${module.duration} minutes`}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <AssignmentTurnedInIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Score minimum requis" 
                  secondary={`${module.minimumPassingScore}%`}
                />
              </ListItem>
              
              <ListItem>
                <ListItemIcon>
                  <PeopleIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Créé par" 
                  secondary={module.createdBy ? `${module.createdBy.firstName} ${module.createdBy.lastName}` : 'Utilisateur inconnu'}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

// Composant pour afficher la liste des cours
const CoursesListCard = ({ courses, moduleId, navigate }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Cours ({courses.length})</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<BookIcon />}
            onClick={() => navigate(`/admin/modules/${moduleId}/courses`)}
          >
            Gérer les cours
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {courses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" color="textSecondary">
              Aucun cours n'a été ajouté à ce module
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BookIcon />}
              sx={{ mt: 2 }}
              onClick={() => navigate(`/admin/modules/${moduleId}/courses/create`)}
            >
              Ajouter un cours
            </Button>
          </Box>
        ) : (
          <Paper variant="outlined">
            <List sx={{ p: 0 }}>
              {courses.map((course, index) => (
                <React.Fragment key={course._id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <Tooltip title="Modifier">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <BookIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${course.order}. ${course.title}`}
                      secondary={`${course.duration} minutes · ${course.type === 'video' ? 'Vidéo' : 'Texte'}`}
                    />
                  </ListItem>
                  {index < courses.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

// Composant pour afficher l'examen
const ExamCard = ({ exam, moduleId, navigate }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Examen final</Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<AssignmentIcon />}
            onClick={() => navigate(`/admin/modules/${moduleId}/exam`)}
          >
            Gérer l'examen
          </Button>
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {!exam ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" color="textSecondary">
              Aucun examen n'a été configuré pour ce module
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AssignmentIcon />}
              sx={{ mt: 2 }}
              onClick={() => navigate(`/admin/modules/${moduleId}/exam/create`)}
            >
              Créer un examen
            </Button>
          </Box>
        ) : (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">{exam.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {exam.description}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">{exam.duration} minutes</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssignmentTurnedInIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="body2">{exam.questions?.length || 0} questions</Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chip 
                    size="small" 
                    label={exam.status === 'published' ? 'Publié' : 'Brouillon'} 
                    color={exam.status === 'published' ? 'success' : 'warning'} 
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}
      </CardContent>
    </Card>
  );
};

// Composant principal
const ModuleDetailsPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [module, setModule] = useState(null);
  const [courses, setCourses] = useState([]);
  const [exam, setExam] = useState(null);
  const [stats, setStats] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(location.state?.alert || null);
  
  const [activeTab, setActiveTab] = useState(0);
  
  // Charger les données du module
  useEffect(() => {
    const loadModuleData = async () => {
      try {
        setLoading(true);
        
        // Charger les informations du module
        const moduleData = await fetchModuleById(moduleId);
        setModule(moduleData);
        
        // Charger les contenus du module (cours et examen)
        const contentsData = await fetchModuleContents(moduleId);
        setCourses(contentsData.courses || []);
        setExam(contentsData.exam || null);
        
        // Charger les statistiques du module
        try {
          const statsData = await fetchModuleStats(moduleId);
          setStats(statsData);
        } catch (statsError) {
          console.error('Error loading module stats:', statsError);
          // Ne pas faire échouer le chargement complet si seulement les stats échouent
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading module data:', err);
        setError('Erreur lors du chargement des données du module: ' + (err.message || err));
      } finally {
        setLoading(false);
      }
    };
    
    loadModuleData();
  }, [moduleId]);
  
  // Fonction pour changer d'onglet
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Fermer l'alerte
  const handleCloseAlert = () => {
    setAlert(null);
    // Effacer également l'état de localisation pour éviter de réafficher l'alerte
    if (location.state?.alert) {
      navigate(location.pathname, { replace: true });
    }
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
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/admin/modules')}
            >
              Retour
            </Button>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h1">
              {module.title}
            </Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/admin/modules/${moduleId}/edit`)}
              >
                Modifier
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => {
                  // Rediriger vers la page des modules avec une demande de suppression
                  navigate('/admin/modules', { 
                    state: { 
                      deleteRequest: { 
                        id: moduleId, 
                        title: module.title 
                      } 
                    } 
                  });
                }}
              >
                Supprimer
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 3 }} 
          onClose={handleCloseAlert}
        >
          {alert.message}
        </Alert>
      )}
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Aperçu" />
        <Tab label="Contenu" />
        <Tab label="Statistiques" />
      </Tabs>
      
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ModuleInfoCard module={module} />
          </Grid>
        </Grid>
      )}
      
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CoursesListCard 
              courses={courses} 
              moduleId={moduleId} 
              navigate={navigate} 
            />
          </Grid>
          <Grid item xs={12}>
            <ExamCard 
              exam={exam} 
              moduleId={moduleId} 
              navigate={navigate} 
            />
          </Grid>
        </Grid>
      )}
      
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistiques d'utilisation
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {!stats ? (
                  <Box sx={{ textAlign: 'center', py: 2 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Chargement des statistiques...
                    </Typography>
                  </Box>
                ) : Object.keys(stats).length === 0 ? (
                  <Typography variant="body1" color="textSecondary" align="center">
                    Aucune statistique disponible pour ce module
                  </Typography>
                ) : (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h3" color="primary">
                          {stats.totalEnrollments || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Utilisateurs inscrits
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h3" color="primary">
                          {stats.completionRate || 0}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Taux de complétion
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h3" color="primary">
                          {stats.averageExamScore || 0}%
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Score moyen à l'examen
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default ModuleDetailsPage;