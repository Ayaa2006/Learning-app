// src/pages/Modules.jsx
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
  CssBaseline,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Breadcrumbs,
  LinearProgress
} from '@mui/material';

// Importez uniquement les icônes que vous utilisez effectivement
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DarkModeIcon from '@mui/icons-material/Brightness4';
import LightModeIcon from '@mui/icons-material/Brightness7';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SortIcon from '@mui/icons-material/Sort';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

// Catégories de modules avec des icônes simplifiées
const categories = [
  { id: 'all', name: 'Toutes les catégories', icon: <BookIcon /> },
  { id: 'programming', name: 'Programmation', icon: <BookIcon /> },
  { id: 'data-science', name: 'Data Science', icon: <SchoolIcon /> },
  { id: 'business', name: 'Business', icon: <AssignmentIcon /> },
  { id: 'design', name: 'Design', icon: <BookIcon /> },
  { id: 'personal-dev', name: 'Développement Personnel', icon: <PeopleIcon /> },
  { id: 'science', name: 'Sciences', icon: <BookIcon /> },
  { id: 'math', name: 'Mathématiques', icon: <AssignmentIcon /> }
];

// Niveaux de difficulté
const levels = [
  { id: 'all', name: 'Tous les niveaux' },
  { id: 'beginner', name: 'Débutant' },
  { id: 'intermediate', name: 'Intermédiaire' },
  { id: 'advanced', name: 'Avancé' },
  { id: 'expert', name: 'Expert' }
];

// Options de tri
const sortOptions = [
  { id: 'popular', name: 'Les plus populaires' },
  { id: 'newest', name: 'Les plus récents' },
  { id: 'rating', name: 'Mieux notés' },
  { id: 'az', name: 'A-Z' },
  { id: 'za', name: 'Z-A' }
];

// Données fictives pour les modules
const mockModules = [
  {
    id: 1,
    title: 'Intelligence Artificielle: Fondamentaux',
    description: 'Découvrez les concepts clés de l\'IA, des algorithmes fondamentaux aux applications modernes.',
    image: '/images/bck7.png',
    duration: '12 heures',
    lessons: 24,
    level: 'Intermédiaire',
    rating: 4.8,
    reviews: 428,
    students: 4500,
    category: 'data-science',
    instructor: 'Dr. Sophie Durand',
    featured: true,
    tags: ['Machine Learning', 'Deep Learning', 'Neural Networks'],
    lastUpdated: '2025-01-15'
  },
  {
    id: 2,
    title: 'Développement Web Full-Stack',
    description: 'Maîtrisez les technologies front-end et back-end pour créer des applications web complètes.',
    image: '/images/bck11.png',
    duration: '24 heures',
    lessons: 42,
    level: 'Avancé',
    rating: 4.7,
    reviews: 612,
    students: 6200,
    category: 'programming',
    instructor: 'Thomas Martin',
    featured: true,
    tags: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    lastUpdated: '2025-02-10'
  },
  {
    id: 3,
    title: 'Data Science & Visualisation',
    description: 'Apprenez à analyser et visualiser des données complexes pour en extraire des insights pertinents.',
    image: '/images/bck2.png',
    duration: '16 heures',
    lessons: 28,
    level: 'Intermédiaire',
    rating: 4.9,
    reviews: 523,
    students: 5800,
    category: 'data-science',
    instructor: 'Emma Dubois',
    featured: true,
    tags: ['Python', 'Pandas', 'Matplotlib', 'D3.js'],
    lastUpdated: '2025-01-28'
  },
  {
    id: 4,
    title: 'Fondamentaux de la Programmation Python',
    description: 'Une introduction complète à Python, l\'un des langages de programmation les plus polyvalents et populaires.',
    image: '/images/bck9.png',
    duration: '10 heures',
    lessons: 18,
    level: 'Débutant',
    rating: 4.6,
    reviews: 789,
    students: 12500,
    category: 'programming',
    instructor: 'Lucas Bernard',
    featured: false,
    tags: ['Python', 'Algorithmique', 'Structures de données'],
    lastUpdated: '2025-02-05'
  },
  {
    id: 5,
    title: 'Marketing Digital Stratégique',
    description: 'Développez une stratégie marketing digitale efficace pour augmenter votre visibilité en ligne et générer des leads.',
    image: '/images/bck8.png',
    duration: '14 heures',
    lessons: 22,
    level: 'Intermédiaire',
    rating: 4.5,
    reviews: 356,
    students: 4200,
    category: 'business',
    instructor: 'Julie Moreau',
    featured: false,
    tags: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
    lastUpdated: '2025-01-20'
  },
  {
    id: 6,
    title: 'Design UX/UI Moderne',
    description: 'Maîtrisez les principes et outils du design d\'interface utilisateur et d\'expérience utilisateur.',
    image: '/images/bck10.png',
    duration: '18 heures',
    lessons: 32,
    level: 'Intermédiaire',
    rating: 4.7,
    reviews: 412,
    students: 3800,
    category: 'design',
    instructor: 'Clara Lefèvre',
    featured: false,
    tags: ['Figma', 'Design Thinking', 'Wireframing', 'Prototyping'],
    lastUpdated: '2025-02-15'
  },
  {
    id: 7,
    title: 'Machine Learning Avancé',
    description: 'Exploration approfondie des algorithmes de machine learning et de leur mise en œuvre pratique.',
    image: '/images/bck22.png',
    duration: '20 heures',
    lessons: 36,
    level: 'Avancé',
    rating: 4.9,
    reviews: 287,
    students: 2900,
    category: 'data-science',
    instructor: 'Dr. Antoine Mercier',
    featured: false,
    tags: ['Scikit-learn', 'TensorFlow', 'Model Optimization', 'Feature Engineering'],
    lastUpdated: '2025-01-08'
  },
  {
    id: 8,
    title: 'Leadership et Management d\'Équipe',
    description: 'Développez vos compétences en leadership pour gérer efficacement des équipes et stimuler l\'innovation.',
    image: '/images/bck6.png',
    duration: '12 heures',
    lessons: 20,
    level: 'Intermédiaire',
    rating: 4.6,
    reviews: 324,
    students: 4800,
    category: 'business',
    instructor: 'Philippe Laurent',
    featured: false,
    tags: ['Gestion d\'équipe', 'Communication', 'Résolution de conflits'],
    lastUpdated: '2025-02-18'
  },
  {
    id: 9,
    title: 'Sécurité Informatique: Ethical Hacking',
    description: 'Apprenez à identifier et exploiter les vulnérabilités de sécurité pour mieux protéger les systèmes informatiques.',
    image: '/images/bck17.png',
    duration: '16 heures',
    lessons: 26,
    level: 'Avancé',
    rating: 4.8,
    reviews: 312,
    students: 3200,
    category: 'programming',
    instructor: 'Mathieu Girard',
    featured: false,
    tags: ['Cybersécurité', 'Penetration Testing', 'Network Security'],
    lastUpdated: '2025-01-25'
  },
  {
    id: 10,
    title: 'Développement d\'Applications Mobiles avec React Native',
    description: 'Créez des applications mobiles natives pour iOS et Android avec un seul code base en utilisant React Native.',
    image: '/images/bck15.png',
    duration: '18 heures',
    lessons: 30,
    level: 'Intermédiaire',
    rating: 4.7,
    reviews: 285,
    students: 3600,
    category: 'programming',
    instructor: 'Amélie Petit',
    featured: false,
    tags: ['React Native', 'JavaScript', 'Mobile Development'],
    lastUpdated: '2025-02-12'
  },
  {
    id: 11,
    title: 'Introduction à l\'Astrophysique',
    description: 'Explorez les fondements de l\'astrophysique, des lois fondamentales aux dernières découvertes sur notre univers.',
    image:'/images/bck21.png',
    duration: '14 heures',
    lessons: 24,
    level: 'Débutant',
    rating: 4.9,
    reviews: 198,
    students: 2200,
    category: 'science',
    instructor: 'Dr. Jean Leclerc',
    featured: false,
    tags: ['Astronomie', 'Physique', 'Cosmologie'],
    lastUpdated: '2025-01-30'
  },
  {
    id: 12,
    title: 'Statistiques et Probabilités Appliquées',
    description: 'Maîtrisez les concepts fondamentaux de statistiques et de probabilités avec des applications pratiques.',
    image: '/images/bck20.png',
    duration: '15 heures',
    lessons: 28,
    level: 'Intermédiaire',
    rating: 4.6,
    reviews: 246,
    students: 3100,
    category: 'math',
    instructor: 'Dr. Sarah Cohen',
    featured: false,
    tags: ['Statistiques', 'Probabilités', 'Data Analysis'],
    lastUpdated: '2025-02-08'
  },
  {
    id: 13,
    title: 'Intelligence Émotionnelle au Travail',
    description: 'Développez votre intelligence émotionnelle pour améliorer vos relations professionnelles et votre efficacité.',
    image: '/images/bck4.png',
    duration: '8 heures',
    lessons: 16,
    level: 'Débutant',
    rating: 4.8,
    reviews: 320,
    students: 5600,
    category: 'personal-dev',
    instructor: 'Sophie Renaud',
    featured: false,
    tags: ['Soft Skills', 'Communication', 'Gestion du stress'],
    lastUpdated: '2025-01-22'
  },
  {
    id: 14,
    title: 'Animation et Motion Design',
    description: 'Apprenez à créer des animations captivantes et du motion design pour vos projets digitaux.',
    image: '/images/bck19.png',
    duration: '16 heures',
    lessons: 28,
    level: 'Intermédiaire',
    rating: 4.7,
    reviews: 189,
    students: 2800,
    category: 'design',
    instructor: 'Nicolas Duval',
    featured: false,
    tags: ['After Effects', 'Motion Graphics', 'Animation Principles'],
    lastUpdated: '2025-02-14'
  },
  {
    id: 15,
    title: 'Cloud Computing avec AWS',
    description: 'Maîtrisez les services cloud d\'Amazon Web Services pour déployer et gérer des applications à grande échelle.',
    image: '/images/bck16.png',
    duration: '20 heures',
    lessons: 34,
    level: 'Avancé',
    rating: 4.8,
    reviews: 276,
    students: 3400,
    category: 'programming',
    instructor: 'David Moreau',
    featured: false,
    tags: ['AWS', 'Cloud Architecture', 'DevOps'],
    lastUpdated: '2025-01-18'
  },
  {
    id: 16,
    title: 'Introduction à la Blockchain',
    description: 'Découvrez les principes fondamentaux de la technologie blockchain et ses applications au-delà des cryptomonnaies.',
    image:'/images/bck18.png',
    duration: '12 heures',
    lessons: 22,
    level: 'Débutant',
    rating: 4.6,
    reviews: 210,
    students: 2900,
    category: 'programming',
    instructor: 'Marc Rousseau',
    featured: false,
    tags: ['Blockchain', 'Cryptography', 'Smart Contracts'],
    lastUpdated: '2025-02-20'
  }
];

const Modules = () => {
  // État pour le mode sombre/clair
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true; // Par défaut en mode sombre
  });
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État pour le menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Détecter les appareils mobiles
  const isMobile = useMediaQuery('(max-width:900px)');
  
  // Nombre de modules par page
  const modulesPerPage = 8;
  
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
  
  // Simuler le chargement des données
  useEffect(() => {
    setLoading(true);
    
    // Simuler une requête API avec un délai
    const timer = setTimeout(() => {
      setModules(mockModules);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtrer les modules en fonction des critères
  useEffect(() => {
    let filtered = [...modules];
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(module => 
        module.title.toLowerCase().includes(query) || 
        module.description.toLowerCase().includes(query) ||
        module.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(module => module.category === selectedCategory);
    }
    
    // Filtrer par niveau
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(module => module.level.toLowerCase() === selectedLevel);
    }
    
    // Trier les modules
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.students - a.students);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'az':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        filtered.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }
    
    setFilteredModules(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  }, [searchQuery, selectedCategory, selectedLevel, sortBy, modules]);
  
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
  
  // Gérer le changement de page
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    // Scroll en haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Calculer les modules à afficher sur la page actuelle
  const indexOfLastModule = currentPage * modulesPerPage;
  const indexOfFirstModule = indexOfLastModule - modulesPerPage;
  const currentModules = filteredModules.slice(indexOfFirstModule, indexOfLastModule);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredModules.length / modulesPerPage);
  
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
                  <Button component={Link} to="/modules" color="inherit" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Modules</Button>
                  <Button component={Link} to="/courses" color="inherit">Cours</Button>
                  <Button component={Link} to="/certifications" color="inherit">Certifications</Button>
                  <Button component={Link} to="/about" color="inherit">À propos</Button>
                  <Button component={Link} to="/Home" color="inherit">Home</Button>
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
            py: { xs: 5, md: 8 },
            backgroundImage: 'url("/images/big_pic.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            color: '#fff',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(10, 14, 23, 0.75)',
              zIndex: 0
            }
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              sx={{ 
                fontWeight: 800,
                mb: 2,
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Catalogue de Modules
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                mb: { xs: 4, md: 6 },
                color: 'rgba(255,255,255,0.9)',
                maxWidth: '800px',
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              Découvrez notre collection complète de modules d'apprentissage de qualité professionnelle, conçus par des experts et validés par l'industrie.
            </Typography>
            
            {/* Breadcrumbs */}
            <Breadcrumbs 
              separator={<NavigateNextIcon fontSize="small" />} 
              aria-label="breadcrumb"
              sx={{ 
                mb: 4,
                '& .MuiBreadcrumbs-separator': {
                  color: 'rgba(255,255,255,0.5)',
                },
                '& a': {
                  color: 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#fff',
                    textDecoration: 'underline',
                  }
                }
              }}
            >
              <Link to="/">Accueil</Link>
              <Typography color="white">Modules</Typography>
            </Breadcrumbs>
          </Container>
        </Box>
        
        {/* Modules Content */}
        <Box component="section" sx={{ py: 4, flexGrow: 1 }}>
          <Container maxWidth="lg">
            {/* Filters Section */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                {/* Search Bar */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Rechercher un module..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      }
                    }}
                  />
                </Grid>
                
                {/* Category Filter */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth variant="outlined" sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '8px' }}>
                    <InputLabel id="category-select-label">Catégorie</InputLabel>
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      label="Catégorie"
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
                              {category.icon}
                            </Box>
                            {category.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Level Filter */}
                <Grid item xs={12} sm={6} md={2.5}>
                  <FormControl fullWidth variant="outlined" sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '8px' }}>
                    <InputLabel id="level-select-label">Niveau</InputLabel>
                    <Select
                      labelId="level-select-label"
                      id="level-select"
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      label="Niveau"
                    >
                      {levels.map((level) => (
                        <MenuItem key={level.id} value={level.id}>
                          {level.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Sort By */}
                <Grid item xs={12} sm={6} md={2.5}>
                  <FormControl fullWidth variant="outlined" sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '8px' }}>
                    <InputLabel id="sort-select-label">Trier par</InputLabel>
                    <Select
                      labelId="sort-select-label"
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Trier par"
                      startAdornment={<SortIcon sx={{ ml: 1, mr: -0.5, color: theme.palette.primary.main }} />}
                    >
                      {sortOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            
            {/* Results Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {loading ? 'Chargement des modules...' : `${filteredModules.length} module(s) trouvé(s)`}
              </Typography>
              
              {/* Clear Filters Button - Show only when filters are applied */}
              {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all' || sortBy !== 'popular') && !loading && (
                <Button 
                  variant="text" 
                  color="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSortBy('popular');
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </Box>
            
            {/* Loading Indicator */}
            {loading && (
              <Box sx={{ width: '100%', mb: 4 }}>
                <LinearProgress />
                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                  Chargement des modules...
                </Typography>
              </Box>
            )}
            
            {/* No Results Message */}
            {!loading && filteredModules.length === 0 && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: '12px',
                  border: `1px solid ${theme.palette.divider}`,
                  mb: 4
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Aucun module ne correspond à vos critères
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Essayez d'ajuster vos filtres ou votre recherche pour trouver ce que vous cherchez.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSortBy('popular');
                  }}
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    color: darkMode ? darkMode : '#0a0e17',
                  }}
                >
                  Voir tous les modules
                </Button>
              </Paper>
            )}
            
            {/* Modules Grid */}
            {!loading && filteredModules.length > 0 && (
              <Grid container spacing={3}>
                {currentModules.map((module) => (
                  <Grid item key={module.id} xs={12} sm={6} md={3}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: darkMode ? '0 12px 28px rgba(0,0,0,0.4)' : '0 12px 28px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      {/* Featured Badge */}
                      {module.featured && (
                        <Chip
                          label="Populaire"
                          color="primary"
                          size="small"
                          sx={{ 
                            position: 'absolute', 
                            top: 10, 
                            left: 10, 
                            zIndex: 1,
                            fontWeight: 'bold'
                          }}
                        />
                      )}
                      
                      <CardMedia
                        component="img"
                        height="160"
                        image={module.image}
                        alt={module.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                          <Chip 
                            size="small" 
                            label={module.level} 
                            sx={{ 
                              bgcolor: 'rgba(255,153,0,0.1)', 
                              color: theme.palette.primary.main,
                              fontWeight: 'medium'
                            }} 
                          />
                        </Box>
                        
                        <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                          {module.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                          {module.description.length > 100 
                            ? `${module.description.substring(0, 100)}...` 
                            : module.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.primary.main }} />
                            <Typography variant="body2" fontWeight="bold">
                              {module.rating.toFixed(1)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            ({module.reviews} avis)
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ fontSize: '0.85rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {module.duration}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <SchoolIcon sx={{ fontSize: '0.85rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {module.lessons} cours
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Button 
                          variant="outlined" 
                          fullWidth
                          sx={{ 
                            mt: 2,
                            color: theme.palette.primary.main, 
                            borderColor: theme.palette.primary.main,
                            '&:hover': { 
                              borderColor: theme.palette.primary.dark,
                              bgcolor: 'rgba(255,153,0,0.05)'
                            }
                          }}
                          component={Link}
                          to={`/modules/${module.id}`}
                        >
                          Détails du module
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Pagination */}
            {!loading && filteredModules.length > modulesPerPage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Box>
            )}
            
            {/* Call to Action Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                mt: 8,
                borderRadius: '16px',
                background: darkMode 
                  ? 'linear-gradient(145deg, rgba(25, 118, 210, 0.1), rgba(255, 153, 0, 0.1))' 
                  : 'linear-gradient(145deg, rgba(25, 118, 210, 0.05), rgba(255, 153, 0, 0.05))',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Prêt à développer vos compétences ?
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    Accédez à tous nos modules et parcours d'apprentissage personnalisés en vous inscrivant dès aujourd'hui.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button 
                      variant="outlined"
                      sx={{ 
                        borderColor: theme.palette.primary.main, 
                        color: theme.palette.primary.main,
                        px: 3,
                        py: 1
                      }}
                      component={Link}
                      to="/login"
                    >
                      se connecter
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Box
                    component="img"
                    src="/images/bck24 (2).png"
                    alt="Apprentissage en ligne"
                    sx={{ width: '100%', maxWidth: '400px', display: 'block', mx: 'auto' }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
        
        {/* Footer */}
        <Box component="footer" sx={{ py: 6, bgcolor: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Typography 
                  variant="h5" 
                  component={Link} 
                  to="/" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: 'text.primary', 
                    textDecoration: 'none',
                    display: 'inline-block',
                    mb: 2
                  }}
                >
                  Skill<span style={{ color: theme.palette.primary.main }}>Path</span>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  SkillPath est une plateforme d'apprentissage en ligne qui facilite l'acquisition de compétences à travers un parcours pédagogique structuré et des certifications reconnues.
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
                  <Link to="/modules" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>Modules</Link>
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

export default Modules;