// src/pages/Demo.jsx
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
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Tabs,
  Tab,
  Paper,
  useMediaQuery,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Monitor as MonitorIcon,
  Description as DescriptionIcon,
  Videocam as VideocamIcon,
  Quiz as QuizIcon,
  MenuBook as MenuBookIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const Demo = () => {
  // État pour le mode sombre/clair
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true; // Par défaut en mode sombre
  });
  
  // État pour l'onglet actif
  const [tabValue, setTabValue] = useState(0);
  
  // État pour l'étape actuelle du stepper
  const [activeStep, setActiveStep] = useState(0);
  
  // Détection des appareils mobiles
  const isMobile = useMediaQuery('(max-width:900px)');
  
  // État pour le menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Données de démonstration
  const demoSteps = [
    { 
      label: 'Introduction', 
      description: 'Vue d\'ensemble du module et des compétences à acquérir',
      icon: <DescriptionIcon /> 
    },
    { 
      label: 'Contenu théorique', 
      description: 'Cours et matériaux d\'apprentissage',
      icon: <MenuBookIcon /> 
    },
    { 
      label: 'Vidéos explicatives', 
      description: 'Tutoriels et démonstrations pratiques',
      icon: <VideocamIcon /> 
    },
    { 
      label: 'Quiz interactifs', 
      description: 'Tests de connaissances et exercices',
      icon: <QuizIcon /> 
    },
    { 
      label: 'Certification', 
      description: 'Examen final et obtention du certificat',
      icon: <CheckCircleIcon /> 
    }
  ];
  
  const moduleFeatures = [
    {
      title: "Progression adaptative",
      description: "L'apprentissage s'adapte à votre rythme et à vos compétences existantes."
    },
    {
      title: "Suivi de performance",
      description: "Visualisez vos progrès et identifiez les domaines à améliorer."
    },
    {
      title: "Projets pratiques",
      description: "Appliquez vos connaissances à des cas réels et à des projets concrets."
    },
    {
      title: "Feedback personnalisé",
      description: "Recevez des commentaires détaillés sur vos travaux et vos quiz."
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
  
  // Gestion des onglets
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Gestion des étapes du stepper
  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, demoSteps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
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
                <MonitorIcon sx={{ ml: 1, color: theme.palette.primary.main }} />
              </Typography>
              
              {/* Menu Desktop */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Button component={Link} to="/Modules" color="inherit">Modules</Button>
                  <Button component={Link} to="/courses" color="inherit">Cours</Button>
                  <Button component={Link} to="/certifications" color="inherit">Certifications</Button>
                  <Button component={Link} to="/about" color="inherit">À propos</Button>
                </Box>
              )}
              
              {/* Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Toggle Theme */}
                <IconButton onClick={toggleDarkMode} color="inherit">
                  {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
                
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
                      sx={{ bgcolor: theme.palette.primary.main, color: darkMode ? '#0a0e17' : '#0a0e17' }}
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button component={Link} to="/modules" color="inherit" onClick={toggleMobileMenu}>Modules</Button>
                <Button component={Link} to="/courses" color="inherit" onClick={toggleMobileMenu}>Cours</Button>
                <Button component={Link} to="/certifications" color="inherit" onClick={toggleMobileMenu}>Certifications</Button>
                <Button component={Link} to="/about" color="inherit" onClick={toggleMobileMenu}>À propos</Button>
              </Box>
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
                    sx={{ bgcolor: theme.palette.primary.main, color: '#0a0e17' }}
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
            py: 6,
            background: darkMode 
              ? 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' 
              : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 'bold',
                }}
              >
                Découvrez l'expérience <span style={{ color: theme.palette.primary.main }}>SkillPath</span>
              </Typography>
              <Typography 
                variant="h5" 
                color="text.secondary"
                sx={{ 
                  mb: 4,
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                Explorez notre plateforme interactive et voyez comment nous transformons l'apprentissage en ligne
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                startIcon={<PlayArrowIcon />}
                sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  color: '#0a0e17',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                Lancer la démo
              </Button>
            </Box>
          </Container>
        </Box>

        {/* Demo Content */}
        <Box component="section" sx={{ py: 6, flexGrow: 1 }}>
          <Container maxWidth="lg">
            <Paper 
              elevation={darkMode ? 3 : 1}
              sx={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              {/* Tabs */}
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ 
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  '& .MuiTabs-indicator': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              >
                <Tab 
                  label="Parcours d'apprentissage" 
                  icon={<DescriptionIcon />} 
                  iconPosition="start"
                  sx={{
                    py: 3,
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
                <Tab 
                  label="Fonctionnalités" 
                  icon={<MenuBookIcon />} 
                  iconPosition="start"
                  sx={{
                    py: 3,
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
                <Tab 
                  label="Interface" 
                  icon={<VideocamIcon />} 
                  iconPosition="start"
                  sx={{
                    py: 3,
                    '&.Mui-selected': {
                      color: theme.palette.primary.main,
                    },
                  }}
                />
              </Tabs>
              
              {/* Tab Content */}
              <Box sx={{ p: { xs: 3, md: 5 } }}>
                {/* Tab 1: Parcours d'apprentissage */}
                {tabValue === 0 && (
                  <Box>
                    <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
                      Parcours d'apprentissage personnalisé
                    </Typography>
                    
                    <Stepper 
                      activeStep={activeStep} 
                      alternativeLabel={!isMobile}
                      orientation={isMobile ? 'vertical' : 'horizontal'}
                      sx={{ mb: 5 }}
                    >
                      {demoSteps.map((step, index) => (
                        <Step key={step.label}>
                          <StepLabel 
                            StepIconProps={{ 
                              icon: step.icon || index + 1,
                              active: index === activeStep,
                              completed: index < activeStep
                            }}
                          >
                            {step.label}
                          </StepLabel>
                          {isMobile && (
                            <Box sx={{ ml: 3, mt: 1, mb: 2, color: 'text.secondary' }}>
                              {step.description}
                            </Box>
                          )}
                        </Step>
                      ))}
                    </Stepper>
                    
                    {!isMobile && (
                      <Paper 
                        elevation={0}
                        sx={{ 
                          p: 3, 
                          mb: 4, 
                          backgroundColor: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                          borderRadius: '8px',
                          border: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          {demoSteps[activeStep].label}
                        </Typography>
                        <Typography variant="body1">
                          {demoSteps[activeStep].description}
                        </Typography>
                      </Paper>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<ArrowBackIcon />}
                      >
                        Précédent
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        disabled={activeStep === demoSteps.length - 1}
                        endIcon={<ArrowForwardIcon />}
                        sx={{ 
                          bgcolor: theme.palette.primary.main, 
                          color: '#0a0e17',
                          '&:hover': {
                            bgcolor: '#ffb347',
                          },
                        }}
                      >
                        Suivant
                      </Button>
                    </Box>
                  </Box>
                )}
                
                {/* Tab 2: Fonctionnalités */}
                {tabValue === 1 && (
                  <Box>
                    <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
                      Fonctionnalités principales
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {moduleFeatures.map((feature, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card 
                            sx={{ 
                              height: '100%', 
                              display: 'flex', 
                              flexDirection: 'column',
                              border: `1px solid ${theme.palette.divider}`,
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.1)'
                              }
                            }}
                          >
                            <CardContent>
                              <Box 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  mb: 2 
                                }}
                              >
                                <Box 
                                  sx={{ 
                                    bgcolor: 'rgba(255, 153, 0, 0.1)', 
                                    borderRadius: '50%',
                                    width: 40,
                                    height: 40,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2
                                  }}
                                >
                                  <CheckCircleIcon sx={{ color: theme.palette.primary.main }} />
                                </Box>
                                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                                  {feature.title}
                                </Typography>
                              </Box>
                              <Typography variant="body1" color="text.secondary">
                                {feature.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Box sx={{ textAlign: 'center', mt: 5 }}>
                      <Button
                        variant="contained"
                        component={Link}
                        to="/register"
                        sx={{ 
                          bgcolor: theme.palette.primary.main, 
                          color: '#0a0e17',
                          px: 4,
                          py: 1.5
                        }}
                      >
                        Commencer gratuitement
                      </Button>
                    </Box>
                  </Box>
                )}
                
                {/* Tab 3: Interface */}
                {tabValue === 2 && (
                  <Box>
                    <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
                      Interface utilisateur intuitive
                    </Typography>
                    
                    <Card 
                      sx={{ 
                        mb: 4,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="400"
                        image="/images/interface-demo.jpg"
                        alt="Interface SkillPath"
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                    
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Design adaptatif
                        </Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                          Notre interface s'adapte parfaitement à tous les appareils, des smartphones aux grands écrans d'ordinateur, offrant une expérience d'apprentissage optimale en toute circonstance.
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Mode sombre / clair
                        </Typography>
                        <Typography variant="body1" paragraph color="text.secondary">
                          Personnalisez votre expérience visuelle selon vos préférences et réduisez la fatigue oculaire avec notre mode sombre élégant ou notre mode clair lumineux.
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Button 
                      variant="outlined" 
                      startIcon={<PlayArrowIcon />}
                      sx={{ 
                        mt: 3,
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main
                      }}
                    >
                      Voir la visite guidée
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Container>
        </Box>
        
        {/* Call to Action */}
        <Box 
          component="section" 
          sx={{ 
            py: 6, 
            backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" component="h2" sx={{ mb: 3, fontWeight: 'bold' }}>
                Prêt à rejoindre SkillPath ?
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Commencez dès aujourd'hui et transformez votre approche de l'apprentissage en ligne
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    color: '#0a0e17',
                    px: 4,
                    py: 1.5
                  }}
                >
                  S'inscrire gratuitement
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  component={Link}
                  to="/contact"
                  sx={{ 
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Contacter l'équipe
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 4, 
            backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                &copy; {new Date().getFullYear()} SkillPath. Tous droits réservés.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Demo;