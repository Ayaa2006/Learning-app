// src/pages/ModuleDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Skeleton,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NetworkCell from '@mui/icons-material/NetworkCell';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ArticleIcon from '@mui/icons-material/Article';
import SendIcon from '@mui/icons-material/Send';

const ModuleDetails = () => {
  const theme = useTheme();
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchModule = async () => {
      try {
        // Simuler un appel API pour récupérer les détails du module
        const response = await new Promise(resolve => setTimeout(() => resolve({
          id: 1,
          title: "Introduction à la Programmation Web",
          description: "Apprenez les bases du HTML, CSS et JavaScript pour créer vos premières pages web interactives.",
          image: "/images/modules/web-programming.jpg",
          category: "programmation",
          level: "débutant",
          duration: "20 heures",
          rating: 4.8,
          students: 3450,
          instructor: {
            name: "Sophie Martin",
            avatar: "/images/instructors/sophie.jpg",
            bio: "Développeuse web passionnée avec 8 ans d'expérience. J'aime partager mes connaissances et aider les autres à progresser.",
          },
          tags: ["HTML", "CSS", "JavaScript"],
          content: [
            {
              title: "Introduction au HTML",
              type: "article",
              duration: "1 heure",
              description: "Découvrez les bases du langage HTML et créez votre première page web."
            },
            {
              title: "Styliser avec CSS",
              type: "video",
              duration: "2 heures",
              description: "Apprenez à utiliser le CSS pour styliser vos pages web et créer des mises en page attrayantes."
            },
            // Ajouter les autres contenus du module ici
          ],
          reviews: [
            {
              user: {
                name: "Jean Dupont",
                avatar: "/images/avatars/avatar1.jpg"
              }, 
              rating: 5,
              comment: "Excellent module ! Les explications sont claires et les exercices pratiques très utiles.",
              date: "il y a 2 semaines"
            },
            // Ajouter les autres avis ici  
          ]
        }), 1500));
        
        if (response) {
          setModule(response);
        } else {
          throw new Error('Erreur lors du chargement du module');
        }
      } catch (err) {
        console.error(err);  
        setError(err.message);
      }
      
      setLoading(false);
    };
    
    fetchModule();
  }, [moduleId]);
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Logique pour soumettre le commentaire ici
    setComment('');
    alert('Votre commentaire a été soumis !');
  };
  
  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: '12px', mb: 4 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />  
            <Skeleton variant="text" width={200} height={30} />
          </Box>
          
          <Skeleton variant="text" width="60%" height={50} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={8}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: '12px', mb: 2 }} />
              <Skeleton variant="text" width="90%" height={30} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="70%" height={30} />
            </Grid>
            <Grid item xs={12} md={4}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '12px' }} />  
            </Grid>  
          </Grid>
        </Container>
      </Box>  
    );
  }
  
  if (error) {
    return (
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" paragraph>Oups ! Un problème est survenu</Typography>  
          <Typography sx={{ mb: 4 }}>
            {error}. Veuillez réessayer ultérieurement.
          </Typography>
          <Button
            component={RouterLink}
            to="/modules"
            variant="contained"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              bgcolor: theme.palette.primary.main,
              color: 'white',
              '&:hover': { bgcolor: theme.palette.primary.dark }  
            }}
          >
            Retour aux modules
          </Button>
        </Container>
      </Box>
    );
  }
  
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Button
          component={RouterLink}
          to="/modules" 
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 4 }}
        >
          Retour aux modules  
        </Button>
        
        {module && (
          <>
            <Box 
              sx={{
                position: 'relative', 
                borderRadius: '12px',
                overflow: 'hidden',
                mb: 4,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)'  
                }
              }}
            >
              <Box
                component="img"
                src={module.image}
                alt={module.title}
                sx={{ 
                  width: '100%', 
                  height: '400px',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  filter: 'brightness(80%)'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',  
                  bottom: 0,
                  left: 0,
                  p: 4,
                  color: 'white',
                  zIndex: 1
                }}
              >
                <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                  {module.title}
                </Typography>
                <Typography variant="h6">
                  {module.description}  
                </Typography>
              </Box>
            </Box>
        
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={module.instructor.avatar} alt={module.instructor.name} sx={{ width: 48, height: 48, mr: 2 }} />
                    <Box>
                      <Typography sx={{ fontWeight: 'bold' }}>{module.instructor.name}</Typography>
                      <Typography variant="body2" color="textSecondary">Instructeur</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, color: theme.palette.text.secondary }}>
                    <Chip icon={<AccessTimeIcon />} label={module.duration} variant="outlined" />
                    <Chip icon={<NetworkCell />} label={module.level} variant="outlined" />
                    {module.tags.map((tag) => (
                      <Chip key={tag} label={tag} variant="outlined" size="small" />
                    ))}  
                  </Box>
                  
                  <Typography paragraph sx={{ mb: 4 }}>{module.instructor.bio}</Typography>
                  
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>Contenu du module</Typography>
                  
                  {module.content.map((item, index) => (
                    <Accordion key={index} elevation={0} square>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {item.type === 'video' ? <OndemandVideoIcon sx={{ mr: 2 }} /> : <ArticleIcon sx={{ mr: 2 }} />}
                          <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>  
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography paragraph>{item.description}</Typography>
                        <Chip
                          icon={<AccessTimeIcon />}
                          label={item.duration} 
                          variant="outlined"
                          size="small"
                          sx={{ mt: 1 }}  
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: '12px' }} elevation={3}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Détails du module</Typography>
                    <Chip label={module.category} color="primary" size="small" />
                  </Box>
                  
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                          <NetworkCell />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Niveau" secondary={module.level} />
                    </ListItem>
                    
                    <ListItem>  
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark' }}>
                          <AccessTimeIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText primary="Durée" secondary={module.duration} />
                    </ListItem>
                    
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark' }}>
                          <NetworkCell />  
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            Évaluation
                            <Box sx={{ ml: 1, display: 'flex' }}>
                              <Rating value={module.rating} readOnly precision={0.5} sx={{ color: 'warning.main' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                ({module.rating})  
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={`${module.students} étudiant(s) inscrit(s)`}
                      />
                    </ListItem>
                  </List>
                  
                  <Button fullWidth variant="contained" size="large" sx={{ mt: 2, borderRadius: '8px' }}>
                    S'inscrire au module
                  </Button>
                </Paper>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 8 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>Avis des étudiants</Typography>
              
              {module.reviews.length > 0 ? (
                <Box sx={{ mt: 4 }}>
                  {module.reviews.map((review, index) => (
                    <Box key={index} sx={{ mb: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={review.user.avatar} alt={review.user.name} sx={{ mr: 2 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 'bold' }}>{review.user.name}</Typography> 
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating value={review.rating} readOnly sx={{ color: 'warning.main', mr: 1 }} />
                            <Typography variant="body2" color="textSecondary">{review.date}</Typography>
                          </Box>
                        </Box>
                      </Box>
                      <Typography paragraph>{review.comment}</Typography>
                      <Divider sx={{ my: 2 }} />
                    </Box>  
                  ))}
                </Box>
              ) : (
                <Typography color="textSecondary">Aucun avis pour le moment.</Typography>  
              )}
              
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mt: 4, mb: 8 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>Laissez un commentaire</Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography component="legend" sx={{ mb: 1 }}>Votre note</Typography>
                  <Rating
                    value={4.5}
                    precision={0.5}
                    sx={{ color: 'warning.main' }}
                    onChange={(event, newValue) => {
                      // Mettre à jour la note ici
                    }}
                  />
                </Box>
                
                <TextField
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Votre commentaire"
                  fullWidth
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                
                <Button
                  type="submit"
                  variant="contained" 
                  endIcon={<SendIcon />}
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    color: 'white',
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                >
                  Envoyer  
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default ModuleDetails;