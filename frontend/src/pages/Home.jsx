// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  AppBar, 
  Toolbar, 
  Divider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useMediaQuery,
  Switch,
  Tooltip,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import {
  Book as BookIcon,
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  VerifiedUser as VerifiedUserIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  EmojiEvents as AwardIcon,
  Timeline as TimelineIcon,
  Monitor as MonitorIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { 
  PlayArrow as PlayArrowIcon,
  ArrowForward as ArrowForwardIcon,
  Twitter as TwitterIcon, 
  LinkedIn as LinkedInIcon, 
  Facebook as FacebookIcon, 
  Instagram as InstagramIcon 
} from '@mui/icons-material';
import { TextField } from '@mui/material';

const Home = () => {
  // État pour le mode sombre/clair
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true; // Par défaut en mode sombre
  });
  
  // État pour le menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Détecter les appareils mobiles
  const isMobile = useMediaQuery('(max-width:900px)');
  
  // Statistiques du site
  const stats = [
    { label: 'Utilisateurs', value: '250K+', icon: <PeopleIcon /> },
    { label: 'Modules', value: '120+', icon: <BookIcon /> },
    { label: 'Certifications', value: '45+', icon: <VerifiedUserIcon /> },
    { label: 'Taux de réussite', value: '92%', icon: <AwardIcon /> }
  ];
  
  // Modules populaires
  const popularModules = [
    {
      id: 1,
      title: 'Intelligence Artificielle: Fondamentaux',
      description: 'Découvrez les concepts clés de lIA, des algorithmes fondamentaux aux applications modernes.',
      image: '/images/ai-module.jpg',
      duration: '12 heures',
      level: 'Intermédiaire',
      students: 4500
    },
    {
      id: 2,
      title: 'Développement Web Full-Stack',
      description: 'Maîtrisez les technologies front-end et back-end pour créer des applications web complètes.',
      image: '/images/webdev-module.jpg',
      duration: '24 heures',
      level: 'Avancé',
      students: 6200
    },
    {
      id: 3,
      title: 'Data Science & Visualisation',
      description: 'Apprenez à analyser et visualiser des données complexes pour en extraire des insights pertinents.',
      image: '/images/dataviz-module.jpg',
      duration: '16 heures',
      level: 'Intermédiaire',
      students: 5800
    }
  ];
  
  // Témoignages
  const testimonials = [
    {
      id: 1,
      name: 'Sophie Martin',
      role: 'Développeuse Frontend',
      company: 'TechCorp',
      avatar: '/images/avatars/sophie.jpg',
      text: 'Les modules de SkillPath mont permis dacquérir rapidement les compétences nécessaires pour ma reconversion professionnelle. La structure pédagogique est exceptionnelle!'
    },
    {
      id: 2,
      name: 'Thomas Dubois',
      role: 'Data Scientist',
      company: 'DataInsight',
      avatar: '/images/avatars/thomas.jpg',
      text: 'Jai obtenu ma certification en Data Science en seulement 3 mois grâce à SkillPath. La qualité des contenus et lapproche pratique ont fait toute la différence.'
    }
  ];
  
  // Définition du thème en fonction du mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#ff9900',
      },
      secondary: {
        main: '#3a86ff',
      },
      background: {
        default: darkMode ? '#0a0e17' : '#f5f7fa',
        paper: darkMode ? '#111623' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#f0f2f5' : '#0a0e17',
        secondary: darkMode ? '#b0b7c3' : '#4a5568',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
            boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)',
          },
        },
      },
    },
  });
  
  // Sauvegarder le mode dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
  // Toggle pour le mode sombre/clair
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Toggle pour le menu mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navigation */}
        <AppBar position="sticky" color="default" elevation={0} sx={{ backdropFilter: 'blur(8px)', backgroundColor: darkMode ? 'rgba(17, 22, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
          <Container maxWidth="xl">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Logo */}
              <Typography variant="h5" component={Link} to="/" sx={{ fontWeight: 'bold', color: 'text.primary', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                Skill<span style={{ color: theme.palette.primary.main }}>Path</span>
              </Typography>
              
              {/* Menu Desktop */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Button component={Link} to="/Modules" color="inherit">Modules</Button>
                  <Button component={Link} to="/courses" color="inherit">Cours</Button>
                  <Button component={Link} to="/certifications" color="inherit">Certifications</Button>
                  <Button component={Link} to="/about" color="inherit">À propos</Button>
                  <Button component={Link} to="/pricing" color="inherit">Tarifs</Button>
                </Box>
              )}
              
              {/* Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Toggle Theme */}
                <Tooltip title={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}>
                  <IconButton onClick={toggleDarkMode} color="inherit">
                    {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Tooltip>
                
                {/* Mobile Menu Button */}
                {isMobile && (
                  <IconButton onClick={toggleMobileMenu} color="inherit">
                    <MenuIcon />
                  </IconButton>
                )}
                
                {/* Auth Buttons */}
                {!isMobile && (
                  <>
                    <Button
                      variant="outlined"
                      sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}
                      component={Link}
                      to="/login"
                    >
                      Connexion
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: theme.palette.primary.main, color: darkMode ? darkMode : '#0a0e17' }}
                      component={Link}
                      to="/register"
                    >
                      S'inscrire
                    </Button>
                  </>
                )}
              </Box>
            </Toolbar>
          </Container>
          
          {/* Mobile Menu */}
          {isMobile && mobileMenuOpen && (
            <Paper sx={{ width: '100%', p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
              <List>
                <ListItem button component={Link} to="/modules" onClick={toggleMobileMenu}>
                  <ListItemIcon><BookIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Modules" />
                </ListItem>
                <ListItem button component={Link} to="/courses" onClick={toggleMobileMenu}>
                  <ListItemIcon><SchoolIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Cours" />
                </ListItem>
                <ListItem button component={Link} to="/certifications" onClick={toggleMobileMenu}>
                  <ListItemIcon><VerifiedUserIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Certifications" />
                </ListItem>
                <ListItem button component={Link} to="/about" onClick={toggleMobileMenu}>
                  <ListItemIcon><PeopleIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="À propos" />
                </ListItem>
                <ListItem button component={Link} to="/pricing" onClick={toggleMobileMenu}>
                  <ListItemIcon><AssignmentIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Tarifs" />
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    fullWidth
                    variant="outlined" 
                    component={Link} 
                    to="/login"
                    onClick={toggleMobileMenu}
                    sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}
                  >
                    Connexion
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth
                    variant="contained" 
                    component={Link} 
                    to="/register"
                    onClick={toggleMobileMenu}
                    sx={{ bgcolor: theme.palette.primary.main, color: darkMode ? darkMode : '#0a0e17' }}
                  >
                    S'inscrire
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </AppBar>

        {/* Hero Section */}
        <Box 
          component="section"
          sx={{ 
            position: 'relative', 
            overflow: 'hidden',
            py: { xs: 6, md: 12 },
            background: 'linear-gradient(135deg, rgba(10,14,23,0.95) 0%, rgba(19, 39, 67, 0.95) 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff'
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      mb: 2,
                      background: 'linear-gradient(90deg, #ff9900, #ff5500)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      display: 'inline-block'
                    }}
                  >
                    Transformez vos compétences, construisez votre avenir
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4,
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400,
                      lineHeight: 1.5
                    }}
                  >
                    SkillPath offre des parcours d'apprentissage structurés, conçus par des experts et validés par l'industrie.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <Button 
                      variant="contained" 
                      size="large"
                      startIcon={<SchoolIcon />}
                      sx={{ 
                        bgcolor: theme.palette.primary.main, 
                        color: darkMode ? darkMode : '#0a0e17',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem'
                      }}
                      component={Link}
                      to="/register"
                    >
                      Commencer gratuitement
                    </Button>
                    
                    <Button 
                      variant="outlined" 
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      sx={{ 
                        borderColor: 'rgba(255,255,255,0.6)', 
                        color: 'rgba(255,255,255,0.9)',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem'
                      }}
                      component={Link}
                      to="/Demo"
                    >
                      Voir la démo
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Certifications reconnues</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Accès illimité</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                      <Typography>Mise à jour continue</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box 
                  component="img"
                  src="/images/background.jpeg"
                  alt="Apprentissage en ligne"
                  sx={{ 
                    width: '100%',
                    maxWidth: '560px',
                    display: 'block',
                    mx: 'auto',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    transform: 'perspective(1500px) rotateY(-15deg)',
                    transition: 'transform 0.5s ease-in-out',
                    '&:hover': {
                      transform: 'perspective(1500px) rotateY(-5deg)'
                    }
                  }}
                />
              </Grid>
            </Grid>
            
            {/* Statistiques */}
            <Box 
              sx={{ 
                mt: 8, 
                p: 4, 
                borderRadius: '16px', 
                backgroundColor: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <Grid container spacing={3} justifyContent="space-between">
                {stats.map((stat, index) => (
                  <Grid item xs={6} md={3} key={index}>
                    <Box sx={{ textAlign: 'center' }}>
                      <IconButton 
                        sx={{ 
                          bgcolor: 'rgba(255,153,0,0.15)', 
                          mb: 1,
                          p: 1.5
                        }}
                      >
                        {stat.icon}
                      </IconButton>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
          
          {/* Background Shapes */}
          <Box 
            sx={{ 
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              opacity: 0.4,
              zIndex: 0,
              background: 'radial-gradient(circle, rgba(255,153,0,0.1) 0%, rgba(0,0,0,0) 70%), radial-gradient(circle at 30% 70%, rgba(255,153,0,0.08) 0%, rgba(0,0,0,0) 60%)'
            }}
          />
        </Box>

        {/* Caractéristiques section */}
        <Box component="section" sx={{ py: 10 }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                textAlign: 'center', 
                mb: 2
              }}
            >
              Notre approche d'apprentissage
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center',
                mb: 6,
                maxWidth: '800px',
                mx: 'auto',
                color: 'text.secondary'
              }}
            >
              SkillPath combine des méthodologies pédagogiques éprouvées avec les dernières technologies pour offrir une expérience d'apprentissage optimale.
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    borderRadius: '16px',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box 
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: 'rgba(255,153,0,0.1)',
                      mb: 2
                    }}
                  >
                    <TimelineIcon sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
                  </Box>
                  
                  <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                    Parcours progressifs
                  </Typography>
                  
                  <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                    Des modules soigneusement séquencés qui vous guident étape par étape, des concepts fondamentaux aux compétences avancées.
                  </Typography>
                  
                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Contenu adapté à votre niveau" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Prérequis clairs pour chaque module" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Progression mesurable" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    borderRadius: '16px',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box 
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: 'rgba(255,153,0,0.1)',
                      mb: 2
                    }}
                  >
                    <AssignmentIcon sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
                  </Box>
                  
                  <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                    Apprentissage interactif
                  </Typography>
                  
                  <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                    Des exercices pratiques, des quiz interactifs et des projets réels pour consolider vos connaissances théoriques.
                  </Typography>
                  
                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="QCM adaptatifs" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Projets pratiques" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Feedback personnalisé" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 4, 
                    height: '100%', 
                    borderRadius: '16px',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <Box 
                    sx={{
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: '12px',
                      bgcolor: 'rgba(255,153,0,0.1)',
                      mb: 2
                    }}
                  >
                    <VerifiedUserIcon sx={{ color: theme.palette.primary.main, fontSize: 30 }} />
                  </Box>
                  
                  <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                    Certifications fiables
                  </Typography>
                  
                  <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                    Des examens sécurisés et des certifications vérifiables, reconnues par les employeurs et l'industrie.
                  </Typography>
                  
                  <List>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Examens surveillés" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Certificats blockchain" />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Badges partageables" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Modules populaires */}
        <Box 
          component="section" 
          sx={{ 
            py: 10, 
            bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' 
          }}
        >
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                textAlign: 'center', 
                mb: 2
              }}
            >
              Modules les plus populaires
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center',
                mb: 6,
                maxWidth: '800px',
                mx: 'auto',
                color: 'text.secondary'
              }}
            >
              Découvrez les modules plébiscités par notre communauté d'apprenants
            </Typography>
            
            <Grid container spacing={4}>
              {popularModules.map((module) => (
                <Grid item key={module.id} xs={12} md={4}>
                  <Card sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: darkMode ? '0 12px 28px rgba(0,0,0,0.4)' : '0 12px 28px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={module.image}
                      alt={module.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                        <Chip 
                          size="small" 
                          label={module.level} 
                          sx={{ 
                            bgcolor: 'rgba(255,153,0,0.1)', 
                            color: theme.palette.primary.main,
                            fontWeight: 'medium'
                          }} 
                        />
                        <Chip 
                          size="small" 
                          icon={<AccessTimeIcon sx={{ fontSize: '0.85rem !important' }} />} 
                          label={module.duration} 
                          sx={{ 
                            bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            fontWeight: 'medium'
                          }} 
                        />
                      </Box>
                      
                      <Typography gutterBottom variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                        {module.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {module.description}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PeopleIcon sx={{ fontSize: '0.85rem', mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {module.students.toLocaleString()} étudiants
                          </Typography>
                        </Box>
                        
                        <Button 
                          variant="outlined" 
                          size="small"
                          component={Link} 
                          to={`/modules/${module.id}`}
                          sx={{ 
                            color: theme.palette.primary.main, 
                            borderColor: theme.palette.primary.main,
                            '&:hover': { 
                              borderColor: theme.palette.primary.dark,
                              bgcolor: 'rgba(255,153,0,0.05)'
                            }
                          }}
                        >
                          En savoir plus
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: darkMode ? darkMode : '#0a0e17',
                  '&:hover': { bgcolor: theme.palette.primary.dark }
                }}
                component={Link}
                to="/modules"
              >
                Explorer tous les modules
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Témoignages */}
        <Box component="section" sx={{ py: 10 }}>
          <Container maxWidth="lg">
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                textAlign: 'center', 
                mb: 2
              }}
            >
              Ce que nos apprenants disent
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                textAlign: 'center',
                mb: 6,
                maxWidth: '800px',
                mx: 'auto',
                color: 'text.secondary'
              }}
            >
              Des milliers d'apprenants ont transformé leur carrière grâce à SkillPath
            </Typography>
            
            <Grid container spacing={4}>
              {testimonials.map((testimonial) => (
                <Grid item key={testimonial.id} xs={12} md={6}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 4, 
                      borderRadius: '16px',
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%',
                      position: 'relative',
                      '&::before': {
                        content: '"""',
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        fontSize: '4rem',
                        fontFamily: 'Georgia, serif',
                        lineHeight: 1,
                        color: theme.palette.primary.main,
                        opacity: 0.2
                      }
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        mb: 3, 
                        fontStyle: 'italic',
                        fontSize: '1.05rem',
                        lineHeight: 1.6,
                        color: 'text.primary',
                        position: 'relative',
                        zIndex: 1,
                        pl: 2
                      }}
                    >
                      {testimonial.text}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        sx={{ 
                          width: 56, 
                          height: 56,
                          mr: 2,
                          border: `2px solid ${theme.palette.primary.main}`
                        }}
                      />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {testimonial.role}, {testimonial.company}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box 
          component="section" 
          sx={{ 
            py: 10, 
            backgroundImage: 'url("/images/cta-bg.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: darkMode ? 'rgba(10, 14, 23, 0.85)' : 'rgba(10, 14, 23, 0.75)',
              zIndex: 0
            }
          }}
        >
          <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ textAlign: 'center', color: '#fff' }}>
              <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Prêt à développer vos compétences ?
              </Typography>
              
              <Typography variant="h6" sx={{ mb: 5, color: 'rgba(255,255,255,0.8)' }}>
                Rejoignez plus de 250 000 apprenants qui ont déjà transformé leur carrière avec SkillPath
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  startIcon={<SchoolIcon />}
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    color: darkMode ? darkMode : '#0a0e17',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold'
                  }}
                  component={Link}
                  to="/register"
                >
                  Commencer gratuitement
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.6)', 
                    color: '#fff',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: '#fff',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                  component={Link}
                  to="/pricing"
                >
                  Voir les tarifs
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ py: 6, bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }}>
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Typography 
                  variant="h5" 
                  component={Link} 
                  to="/" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'text.primary', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  Skill<span style={{ color: theme.palette.primary.main }}>Path</span>
                  <MonitorIcon sx={{ ml: 1, color: theme.palette.primary.main }} />
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  SkillPath est une plateforme d'apprentissage en ligne qui facilite l'acquisition de compétences à travers un parcours pédagogique structuré, des évaluations pertinentes et des certifications reconnues.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <IconButton sx={{ color: 'text.secondary' }}>
                    <TwitterIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'text.secondary' }}>
                    <LinkedInIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'text.secondary' }}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton sx={{ color: 'text.secondary' }}>
                    <InstagramIcon />
                  </IconButton>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Plateforme
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Link to="/modules" style={{ color: 'text.secondary', textDecoration: 'none' }}>Modules</Link>
                  <Link to="/courses" style={{ color: 'text.secondary', textDecoration: 'none' }}>Cours</Link>
                  <Link to="/certifications" style={{ color: 'text.secondary', textDecoration: 'none' }}>Certifications</Link>
                  <Link to="/instructors" style={{ color: 'text.secondary', textDecoration: 'none' }}>Instructeurs</Link>
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Ressources
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Link to="/blog" style={{ color: 'text.secondary', textDecoration: 'none' }}>Blog</Link>
                  <Link to="/faq" style={{ color: 'text.secondary', textDecoration: 'none' }}>FAQ</Link>
                  <Link to="/support" style={{ color: 'text.secondary', textDecoration: 'none' }}>Support</Link>
                  <Link to="/community" style={{ color: 'text.secondary', textDecoration: 'none' }}>Communauté</Link>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Newsletter
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Recevez nos dernières actualités et offres spéciales directement dans votre boîte mail.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField 
                    variant="outlined" 
                    placeholder="Votre email" 
                    size="small"
                    fullWidth
                    sx={{ 
                      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: '8px'
                    }}
                  />
                  <Button 
                    variant="contained"
                    sx={{ 
                      bgcolor: theme.palette.primary.main, 
                      color: darkMode ? darkMode : '#0a0e17',
                      '&:hover': { bgcolor: theme.palette.primary.dark }
                    }}
                  >
                    S'abonner
                  </Button>
                </Box>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                  En vous inscrivant, vous acceptez notre politique de confidentialité.
                </Typography>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 4 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                &copy; {new Date().getFullYear()} SkillPath. Tous droits réservés.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Link to="/terms" style={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Conditions d'utilisation
                </Link>
                <Link to="/privacy" style={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Politique de confidentialité
                </Link>
                <Link to="/cookies" style={{ color: 'text.secondary', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Cookies
                </Link>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};


export default Home;