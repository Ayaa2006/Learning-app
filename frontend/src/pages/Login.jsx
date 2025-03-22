// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide,
  Tabs,
  Tab,
  Paper,
  Switch,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Google as GoogleIcon,
  Apple as AppleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Menu as MenuIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import Logo from '../components/common/Logo';

const Login = () => {
  // État pour le mode sombre/clair
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false; // Par défaut en mode clair
  });
  
  const theme = useTheme();
  const navigate = useNavigate();
  
  // États pour la gestion des onglets (utilisateur vs admin)
  const [tabValue, setTabValue] = useState(0);
  
  // États pour la connexion utilisateur
  const [userEmail, setUserEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  // États pour la connexion admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // États partagés
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Style constants
  const primaryColor = '#ff9900'; // Orange comme accent
  const darkText = '#0a0e17';
  
  // États pour le header
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modulesMenuAnchor, setModulesMenuAnchor] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Définition du thème en fonction du mode
  const appTheme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: primaryColor,
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

  // Fonction pour cacher le header lors du défilement vers le bas
  function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }

  // Gestion du menu des modules
  const handleModulesMenuOpen = (event) => {
    setModulesMenuAnchor(event.currentTarget);
  };

  const handleModulesMenuClose = () => {
    setModulesMenuAnchor(null);
  };

  // Gestion du menu mobile
  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Gestion des onglets
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError(''); // Réinitialiser les erreurs lors du changement d'onglet
  };

  // Connexion utilisateur avec email académique et date de naissance
  const handleUserLogin = async (e) => {
    e.preventDefault();
    
    if (!userEmail) {
      setError('Veuillez entrer votre email académique');
      return;
    }
    
    if (!birthDate) {
      setError('Veuillez entrer votre date de naissance');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers le tableau de bord étudiant au lieu de la page de progression
      navigate('/student-dashboard');
      console.log('User login successful', { userEmail, birthDate });
    } catch (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Connexion administrateur avec email académique et mot de passe
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!adminEmail) {
      setError('Veuillez entrer votre email académique');
      return;
    }
    
    if (!adminPassword) {
      setError('Veuillez entrer votre mot de passe');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Simulation d'une requête API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Rediriger vers le tableau de bord admin
      navigate('/admin-dashboard');
      console.log('Admin login successful', { adminEmail, adminPassword });
    } catch (err) {
      setError('Identifiants administrateur incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour accéder directement aux pages d'administration (pour test seulement)
  const goToAdminPage = (page) => {
    navigate(page);
  };

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Header avec mode sombre/clair comme sur la page d'accueil */}
        <AppBar position="sticky" color="default" elevation={0} sx={{ backdropFilter: 'blur(8px)', backgroundColor: darkMode ? 'rgba(17, 22, 35, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
          <Container maxWidth="xl">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Logo */}
              <Typography variant="h5" component={Link} to="/" sx={{ fontWeight: 'bold', color: 'text.primary', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                Skill<span style={{ color: appTheme.palette.primary.main }}>Path</span>
              </Typography>
              
              {/* Menu Desktop */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Button 
                    component={Link} 
                    to="/modules" 
                    color="inherit"
                    endIcon={<ExpandMoreIcon />}
                    onClick={handleModulesMenuOpen}
                  >
                    Modules
                  </Button>
                  <Menu
                    anchorEl={modulesMenuAnchor}
                    open={Boolean(modulesMenuAnchor)}
                    onClose={handleModulesMenuClose}
                    MenuListProps={{
                      'aria-labelledby': 'modules-button',
                    }}
                  >
                    <MenuItem onClick={handleModulesMenuClose} component={Link} to="/modules/programming">Programmation</MenuItem>
                    <MenuItem onClick={handleModulesMenuClose} component={Link} to="/modules/design">Design</MenuItem>
                    <MenuItem onClick={handleModulesMenuClose} component={Link} to="/modules/business">Business</MenuItem>
                  </Menu>
                  <Button component={Link} to="/courses" color="inherit">Cours</Button>
                  <Button component={Link} to="/exams" color="inherit">Examens</Button>
                  <Button component={Link} to="/certifications" color="inherit">Certificats</Button>
                  <Button component={Link} to="/about" color="inherit">À propos</Button>
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
                  <IconButton onClick={handleMobileMenuOpen} color="inherit">
                    <MenuIcon />
                  </IconButton>
                )}
                
                {/* Auth Buttons */}
                {!isMobile && (
                  <>
                    <Button
                      variant="outlined"
                      sx={{ borderColor: appTheme.palette.primary.main, color: appTheme.palette.primary.main }}
                      component={Link}
                      to="/login"
                    >
                      Connexion
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: appTheme.palette.primary.main, color: darkMode ? darkMode : '#0a0e17' }}
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
            <Paper sx={{ width: '100%', p: 2, borderTop: `1px solid ${appTheme.palette.divider}` }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MenuItem component={Link} to="/modules" onClick={handleMobileMenuClose}>Modules</MenuItem>
                <MenuItem component={Link} to="/courses" onClick={handleMobileMenuClose}>Cours</MenuItem>
                <MenuItem component={Link} to="/exams" onClick={handleMobileMenuClose}>Examens</MenuItem>
                <MenuItem component={Link} to="/certifications" onClick={handleMobileMenuClose}>Certificats</MenuItem>
                <MenuItem component={Link} to="/about" onClick={handleMobileMenuClose}>À propos</MenuItem>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    fullWidth
                    variant="outlined" 
                    component={Link} 
                    to="/login"
                    onClick={handleMobileMenuClose}
                    sx={{ borderColor: appTheme.palette.primary.main, color: appTheme.palette.primary.main }}
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
                    onClick={handleMobileMenuClose}
                    sx={{ bgcolor: appTheme.palette.primary.main, color: darkMode ? darkMode : '#0a0e17' }}
                  >
                    S'inscrire
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </AppBar>

        {/* Contenu de Login - préservé du code original */}
        <Grid container sx={{ minHeight: 'calc(100vh - 64px)' }}>
          {/* Côté gauche avec illustration */}
          <Grid item xs={12} md={6} sx={{ 
  bgcolor: darkMode ? 'rgba(255,255,255,0.02)' : '#ffffff', 
  color: appTheme.palette.text.primary,
  display: { xs: 'none', md: 'flex' },
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  p: 4,
  position: 'relative'
}}>
  <Box sx={{ 
    display: 'center', 
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',

  }}>
    <img 
      src="/images/login-illustration__2_-removebg-preview (1).png" 
      alt="Login Illustration"
      style={{ 
        width: '100%', 
        maxWidth: '550px',
        height: 'auto', 
      }}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = "https://via.placeholder.com/500x500?text=E-Learning+Login";
      }}
    />
  </Box>
          </Grid>
          
          {/* Côté droit avec formulaire */}
          <Grid item xs={12} md={6} sx={{ 
            p: { xs: 4, sm: 6, md: 10 },
            bgcolor: darkMode ? '#111623' : '#ffffff',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Afficher le logo sur mobile */}
            <Box sx={{ 
              display: { xs: 'flex', md: 'none' }, 
              justifyContent: 'center',
              mb: 4 
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                Skill<span style={{ color: appTheme.palette.primary.main }}>Path</span>
              </Typography>
            </Box>
          
            {error && (
              <Typography color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            
            <Box sx={{ mt: 4, width: '100%' }}>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  fontSize: { xs: '2.2rem', md: '2.5rem' },
                  fontWeight: 'bold',
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Welcome to SkillPath !
              </Typography>
              
              {/* Onglets pour choisir le type de connexion */}
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="login-tabs"
                sx={{ 
                  mb: 4,
                  '& .MuiTabs-indicator': {
                    backgroundColor: primaryColor,
                  },
                  '& .MuiTab-root': {
                    fontWeight: 'bold',
                  }
                }}
              >
                <Tab 
                  icon={<PersonIcon />} 
                  label="Utilisateur" 
                  id="user-tab"
                  aria-controls="user-panel"
                  sx={{
                    '&.Mui-selected': {
                      color: primaryColor,
                    },
                  }}
                />
                <Tab 
                  icon={<SchoolIcon />} 
                  label="Administrateur" 
                  id="admin-tab"
                  aria-controls="admin-panel"
                  sx={{
                    '&.Mui-selected': {
                      color: primaryColor,
                    },
                  }}
                />
              </Tabs>
              
              {/* Panneau de connexion utilisateur avec email académique et date de naissance */}
              <Box
                role="tabpanel"
                hidden={tabValue !== 0}
                id="user-panel"
                aria-labelledby="user-tab"
              >
                {tabValue === 0 && (
                  <Box component="form" onSubmit={handleUserLogin}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Email académique
                    </Typography>
                    <TextField
                      fullWidth
                      id="user-email"
                      name="userEmail"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="Entrez votre email académique"
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{ mb: 3 }}
                    />
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Date de naissance
                    </Typography>
                    <TextField
                      fullWidth
                      id="birth-date"
                      name="birth-date"
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{ mb: 3 }}
                    />
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading || !userEmail || !birthDate}
                      sx={{ 
                        py: 1.5,
                        mb: 3,
                        bgcolor: primaryColor,
                        color: darkText,
                        '&:hover': {
                          bgcolor: '#ffb347'
                        },
                        '&.Mui-disabled': {
                          bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      {loading ? 'Processing...' : 'Log in'}
                    </Button>
                  </Box>
                )}
              </Box>
              
              {/* Panneau de connexion administrateur avec email académique et mot de passe */}
              <Box
                role="tabpanel"
                hidden={tabValue !== 1}
                id="admin-panel"
                aria-labelledby="admin-tab"
              >
                {tabValue === 1 && (
                  <Box component="form" onSubmit={handleAdminLogin}>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Email académique
                    </Typography>
                    <TextField
                      fullWidth
                      id="admin-email"
                      name="adminEmail"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      placeholder="Entrez votre email académique"
                      variant="outlined"
                      margin="normal"
                      required
                      sx={{ mb: 3 }}
                    />
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      Mot de passe
                    </Typography>
                    <TextField
                      fullWidth
                      id="admin-password"
                      name="adminPassword"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      variant="outlined"
                      margin="normal"
                      required
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleTogglePasswordVisibility}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{ mb: 3 }}
                    />
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={loading || !adminEmail || !adminPassword}
                      sx={{ 
                        py: 1.5,
                        mb: 3,
                        bgcolor: primaryColor,
                        color: darkText,
                        '&:hover': {
                          bgcolor: '#ffb347'
                        },
                        '&.Mui-disabled': {
                          bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
                        }
                      }}
                    >
                      {loading ? 'Processing...' : 'Admin Access'}
                    </Button>
                  </Box>
                )}
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              {/* Liens de test pour accéder directement aux pages admin (à enlever en production) */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                  Pages d'administration (Test uniquement)
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/student-dashboard')}
                      sx={{ mb: 1 }}
                    >
                      Dashboard Étudiant
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/admin-dashboard')}
                      sx={{ mb: 1 }}
                    >
                      Dashboard Admin
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/admin-courses')}
                      sx={{ mb: 1 }}
                    >
                      Gestion Cours
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/admin-qcm')}
                      sx={{ mb: 1 }}
                    >
                      Gestion QCM
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/admin-exams')}
                      sx={{ mb: 1 }}
                    >
                      Gestion Examens
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/admin/certificats')}
                      sx={{ mb: 1 }}
                    >
                      Certificats
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/progress')}
                      sx={{ mb: 1 }}
                    >
                      Progression
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/certificate')}
                      sx={{ mb: 1 }}
                    >
                      Mes Certificats
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/ExamPage')}
                      sx={{ mb: 1 }}
                    >
                      Commencer l'Examen
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      variant="outlined"
                      fullWidth
                      onClick={() => goToAdminPage('/ExamWithProctoring')}
                      sx={{ mb: 1, bgcolor: '#ff5722', color: 'white', '&:hover': { bgcolor: '#e64a19' } }}
                    >
                      Examen avec Surveillance
                    </Button>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" sx={{ color: 'text.primary' }}>
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: primaryColor, fontWeight: 'bold', textDecoration: 'none' }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default Login;