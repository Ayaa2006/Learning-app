// src/pages/Courses.jsx
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
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FilterListIcon from '@mui/icons-material/FilterList';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ArticleIcon from '@mui/icons-material/Article';
import QuizIcon from '@mui/icons-material/Quiz';

// Catégories pour les cours
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
  { id: 'duration-asc', name: 'Durée (croissante)' },
  { id: 'duration-desc', name: 'Durée (décroissante)' }
];

// Types de cours
const courseTypes = [
  { id: 'all', name: 'Tous les types' },
  { id: 'video', name: 'Vidéo', icon: <OndemandVideoIcon /> },
  { id: 'article', name: 'Article', icon: <ArticleIcon /> },
  { id: 'quiz', name: 'Quiz', icon: <QuizIcon /> }
];

// Données fictives pour les cours
const mockCourses = [
  {
    id: 1,
    title: 'Introduction au HTML et CSS',
    description: 'Apprenez les bases du développement web avec HTML et CSS pour créer vos premières pages web.',
    image: '/images/bck11.png',
    duration: '3 heures',
    type: 'video',
    level: 'Débutant',
    rating: 4.7,
    reviews: 328,
    students: 12500,
    category: 'programming',
    instructor: 'Sophie Martin',
    moduleId: 2,
    moduleName: 'Développement Web Full-Stack',
    lastUpdated: '2025-02-10',
    tags: ['HTML', 'CSS', 'Web Development']
  },
  {
    id: 2,
    title: 'JavaScript: Les fondamentaux',
    description: 'Maîtrisez les bases du langage JavaScript pour créer des sites web interactifs et dynamiques.',
    image: '/images/bck2.png',
    duration: '4 heures',
    type: 'video',
    level: 'Débutant',
    rating: 4.9,
    reviews: 412,
    students: 10800,
    category: 'programming',
    instructor: 'Thomas Martin',
    moduleId: 2,
    moduleName: 'Développement Web Full-Stack',
    lastUpdated: '2025-02-08',
    tags: ['JavaScript', 'Web Development', 'Programming']
  },
  {
    id: 3,
    title: 'Exploration des données avec Pandas',
    description: 'Apprenez à manipuler et analyser des données en Python avec la bibliothèque Pandas.',
    image: '/images/bck9.png',
    duration: '2.5 heures',
    type: 'video',
    level: 'Intermédiaire',
    rating: 4.8,
    reviews: 253,
    students: 7400,
    category: 'data-science',
    instructor: 'Emma Dubois',
    moduleId: 3,
    moduleName: 'Data Science & Visualisation',
    lastUpdated: '2025-01-25',
    tags: ['Python', 'Pandas', 'Data Analysis']
  },
  {
    id: 4,
    title: 'Les bases de React.js',
    description: 'Découvrez comment créer des interfaces utilisateur modernes avec la bibliothèque React.js.',
    image: '/images/bck7.png',
    duration: '3.5 heures',
    type: 'video',
    level: 'Intermédiaire',
    rating: 4.6,
    reviews: 342,
    students: 9200,
    category: 'programming',
    instructor: 'Thomas Martin',
    moduleId: 2,
    moduleName: 'Développement Web Full-Stack',
    lastUpdated: '2025-02-12',
    tags: ['React', 'JavaScript', 'Frontend']
  },
  {
    id: 5,
    title: 'Node.js et APIs RESTful',
    description: 'Créez des API RESTful robustes avec Node.js et Express pour vos applications web.',
    image: '/images/bck4.png',
    duration: '3 heures',
    type: 'video',
    level: 'Intermédiaire',
    rating: 4.7,
    reviews: 286,
    students: 6800,
    category: 'programming',
    instructor: 'Thomas Martin',
    moduleId: 2,
    moduleName: 'Développement Web Full-Stack',
    lastUpdated: '2025-02-15',
    tags: ['Node.js', 'Express', 'REST API', 'Backend']
  },
  {
    id: 6,
    title: 'Introduction à l\'Intelligence Artificielle',
    description: 'Comprendre les concepts fondamentaux de l\'IA et ses applications dans le monde moderne.',
    image: '/images/bck6.png',
    duration: '2 heures',
    type: 'article',
    level: 'Débutant',
    rating: 4.9,
    reviews: 178,
    students: 8200,
    category: 'data-science',
    instructor: 'Dr. Sophie Durand',
    moduleId: 1,
    moduleName: 'Intelligence Artificielle: Fondamentaux',
    lastUpdated: '2025-01-10',
    tags: ['AI', 'Machine Learning', 'Artificial Intelligence']
  },
  {
    id: 7,
    title: 'Réseaux de Neurones avec TensorFlow',
    description: 'Apprenez à créer et entraîner des réseaux de neurones avec la bibliothèque TensorFlow.',
    image: '/images/bck10.png',
    duration: '4 heures',
    type: 'video',
    level: 'Avancé',
    rating: 4.8,
    reviews: 214,
    students: 5600,
    category: 'data-science',
    instructor: 'Dr. Sophie Durand',
    moduleId: 1,
    moduleName: 'Intelligence Artificielle: Fondamentaux',
    lastUpdated: '2025-01-18',
    tags: ['Deep Learning', 'TensorFlow', 'Neural Networks']
  },
  {
    id: 8,
    title: 'Visualisation de données avec Matplotlib et Seaborn',
    description: 'Créez des visualisations de données attrayantes et informatives en Python.',
    image: '/images/bck8.png',
    duration: '2.5 heures',
    type: 'video',
    level: 'Intermédiaire',
    rating: 4.7,
    reviews: 196,
    students: 6300,
    category: 'data-science',
    instructor: 'Emma Dubois',
    moduleId: 3,
    moduleName: 'Data Science & Visualisation',
    lastUpdated: '2025-01-30',
    tags: ['Data Visualization', 'Python', 'Matplotlib', 'Seaborn']
  },
  {
    id: 9,
    title: 'MongoDB pour développeurs',
    description: 'Maîtrisez la base de données NoSQL MongoDB pour vos applications modernes.',
    image: '/images/bck15.png',
    duration: '3 heures',
    type: 'video',
    level: 'Intermédiaire',
    rating: 4.6,
    reviews: 234,
    students: 5800,
    category: 'programming',
    instructor: 'Thomas Martin',
    moduleId: 2,
    moduleName: 'Développement Web Full-Stack',
    lastUpdated: '2025-02-08',
    tags: ['MongoDB', 'NoSQL', 'Database']
  },
  {
    id: 10,
    title: 'Déploiement d\'Applications Full-Stack',
    description: 'Apprenez à déployer vos applications web sur des services cloud comme AWS, Heroku et Vercel.',
    image: '/images/bck16.png',
    duration: '2 heures',
    type: 'video',
    level: 'Avancé',
    rating: 4.7,
    reviews: 168,
    students: 4200,
    category: 'programming',
    instructor: 'Thomas Martin',
    moduleId: 2,
    moduleName: 'Développement Web Full-Stack',
    lastUpdated: '2025-02-18',
    tags: ['Deployment', 'DevOps', 'Cloud']
  },
  {
    id: 11,
    title: 'Initiation à Python',
    description: 'Découvrez les bases du langage Python et sa syntaxe pour débuter en programmation.',
    image: '/images/bck9.png',
    duration: '2 heures',
    type: 'video',
    level: 'Débutant',
    rating: 4.9,
    reviews: 426,
    students: 15600,
    category: 'programming',
    instructor: 'Lucas Bernard',
    moduleId: 4,
    moduleName: 'Fondamentaux de la Programmation Python',
    lastUpdated: '2025-02-05',
    tags: ['Python', 'Programming', 'Beginner']
  },
  {
    id: 12,
    title: 'Structures de données en Python',
    description: 'Maîtrisez les listes, dictionnaires, tuples et autres structures de données en Python.',
    image: '/images/bck20.png',
    duration: '2.5 heures',
    type: 'video',
    level: 'Intermédiaire',
    rating: 4.7,
    reviews: 312,
    students: 8400,
    category: 'programming',
    instructor: 'Lucas Bernard',
    moduleId: 4,
    moduleName: 'Fondamentaux de la Programmation Python',
    lastUpdated: '2025-02-10',
    tags: ['Python', 'Data Structures', 'Programming']
  },
  {
    id: 13,
    title: 'Quiz: Les bases de l\'HTML et CSS',
    description: 'Testez vos connaissances sur les fondamentaux du HTML et CSS.',
    image: '/images/bck21.png',
    duration: '30 minutes',
    type: 'quiz',
    level: 'Débutant',
    rating: 4.5,
    reviews: 186,
    students: 7800,
    category: 'programming',
    instructor: 'Sophie Martin',
    moduleId: 2,
    moduleName: 'Développement Web Full-Stack',
    lastUpdated: '2025-02-12',
    tags: ['HTML', 'CSS', 'Quiz']
  },
  {
    id: 14,
    title: 'Quiz: JavaScript fondamental',
    description: 'Évaluez votre compréhension des concepts de base de JavaScript.',
    image: '/images/bck22.png',
    duration: '40 minutes',
    type: 'quiz',
    level: 'Débutant',
    rating: 4.6,
    reviews: 213,
    students: 6700,
    category: 'programming',
    instructor: 'Thomas Martin',
    moduleId: 2,
    moduleName: 'Développement Web Full-Stack',
    lastUpdated: '2025-02-14',
    tags: ['JavaScript', 'Quiz', 'Programming']
  },
  {
    id: 15,
    title: 'Tendances actuelles en Intelligence Artificielle',
    description: 'Un aperçu des dernières avancées et tendances dans le domaine de l\'IA.',
    image: '/images/bck7.png',
    duration: '1 heure',
    type: 'article',
    level: 'Intermédiaire',
    rating: 4.8,
    reviews: 142,
    students: 5300,
    category: 'data-science',
    instructor: 'Dr. Sophie Durand',
    moduleId: 1,
    moduleName: 'Intelligence Artificielle: Fondamentaux',
    lastUpdated: '2025-01-20',
    tags: ['AI', 'Machine Learning', 'Trends']
  },
  {
    id: 16,
    title: 'Visualisations interactives avec D3.js',
    description: 'Créez des visualisations de données interactives et dynamiques pour le web avec D3.js.',
    image: '/images/bck17.png',
    duration: '3 heures',
    type: 'video',
    level: 'Avancé',
    rating: 4.7,
    reviews: 156,
    students: 3800,
    category: 'data-science',
    instructor: 'Emma Dubois',
    moduleId: 3,
    moduleName: 'Data Science & Visualisation',
    lastUpdated: '2025-02-02',
    tags: ['D3.js', 'Data Visualization', 'JavaScript']
  }
];

const Courses = () => {
  // État pour le mode sombre/clair
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : true; // Par défaut en mode sombre
  });
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // État pour le menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Détecter les appareils mobiles
  const isMobile = useMediaQuery('(max-width:900px)');
  
  // Nombre de cours par page
  const coursesPerPage = 9;
  
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
      setCourses(mockCourses);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtrer les cours en fonction des critères
  useEffect(() => {
    let filtered = [...courses];
    
    // Filtrer par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query) ||
        course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }
    
    // Filtrer par niveau
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level.toLowerCase() === selectedLevel);
    }

    // Filtrer par type
    if (selectedType !== 'all') {
      filtered = filtered.filter(course => course.type === selectedType);
    }
    
    // Trier les cours
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
      case 'duration-asc':
        filtered.sort((a, b) => {
          const getMinutes = (durationStr) => {
            const match = durationStr.match(/(\d+(\.\d+)?)\s*(heures?|minutes?)/);
            if (!match) return 0;
            const value = parseFloat(match[1]);
            const unit = match[3];
            return unit.startsWith('heure') ? value * 60 : value;
          };
          return getMinutes(a.duration) - getMinutes(b.duration);
        });
        break;
      case 'duration-desc':
        filtered.sort((a, b) => {
          const getMinutes = (durationStr) => {
            const match = durationStr.match(/(\d+(\.\d+)?)\s*(heures?|minutes?)/);
            if (!match) return 0;
            const value = parseFloat(match[1]);
            const unit = match[3];
            return unit.startsWith('heure') ? value * 60 : value;
          };
          return getMinutes(b.duration) - getMinutes(a.duration);
        });
        break;
      default:
        break;
    }
    
    setFilteredCourses(filtered);
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  }, [searchQuery, selectedCategory, selectedLevel, selectedType, sortBy, courses]);
  
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
  
  // Calculer les cours à afficher sur la page actuelle
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Obtenir l'icône pour le type de cours
  const getCourseTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <OndemandVideoIcon sx={{ fontSize: '1rem', mr: 0.5 }} />;
      case 'article':
        return <ArticleIcon sx={{ fontSize: '1rem', mr: 0.5 }} />;
      case 'quiz':
        return <QuizIcon sx={{ fontSize: '1rem', mr: 0.5 }} />;
      default:
        return <BookIcon sx={{ fontSize: '1rem', mr: 0.5 }} />;
    }
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
                  <Button component={Link} to="/modules" color="inherit">Modules</Button>
                  <Button component={Link} to="/courses" color="inherit" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>Cours</Button>
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
            py: { xs: 6, md: 10 },
            color: '#fff'
          }}
        >
          {/* Image d'arrière-plan */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("/images/courses-header-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(4px)', // Ajout du flou
              transform: 'scale(1.05)', // Légèrement agrandi pour éviter les bords blancs dus au flou
              zIndex: 0
            }}
          />
          
          {/* Overlay sombre pour améliorer la lisibilité */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(10, 14, 23, 0.65)', // Overlay sombre semi-transparent
              zIndex: 1
            }}
          />

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box>
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
                    Catalogue de Cours
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
                    Des cours de qualité sur une variété de sujets pour vous aider à développer de nouvelles compétences et atteindre vos objectifs professionnels.
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
                    <Typography color="white">Cours</Typography>
                  </Breadcrumbs>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                    <Button 
                      variant="contained" 
                      size="large"
                      startIcon={<PlayArrowIcon />}
                      sx={{ 
                        bgcolor: theme.palette.primary.main, 
                        color: darkMode ? darkMode : '#0a0e17',
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 'bold'
                      }}
                      component={Link}
                      to="/register"
                    >
                      Commencer gratuitement
                    </Button>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
                {/* Statistics Card */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Nos cours en chiffres
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                          450+
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Cours disponibles
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                          80+
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Instructeurs
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                          4.8
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Note moyenne
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 2 }}>
                        <Typography variant="h3" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                          24h
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                          Support réactif
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
        
        {/* Courses Content */}
        <Box component="section" sx={{ py: 4, flexGrow: 1 }}>
          <Container maxWidth="lg">
            {/* Filters Section */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                {/* Search Bar */}
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Rechercher un cours..."
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
                <Grid item xs={12} sm={6} md={2}>
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
                <Grid item xs={12} sm={6} md={2}>
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
                
                {/* Course Type Filter */}
                <Grid item xs={12} sm={6} md={2}>
                  <FormControl fullWidth variant="outlined" sx={{ bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'white', borderRadius: '8px' }}>
                    <InputLabel id="type-select-label">Type</InputLabel>
                    <Select
                      labelId="type-select-label"
                      id="type-select"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      label="Type"
                    >
                      {courseTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {type.icon && <Box sx={{ mr: 1, color: theme.palette.primary.main }}>{type.icon}</Box>}
                            {type.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                {/* Sort By */}
                <Grid item xs={12} sm={6} md={2}>
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
                {loading ? 'Chargement des cours...' : `${filteredCourses.length} cours trouvé(s)`}
              </Typography>
              
              {/* Clear Filters Button - Show only when filters are applied */}
              {(searchQuery || selectedCategory !== 'all' || selectedLevel !== 'all' || selectedType !== 'all' || sortBy !== 'popular') && !loading && (
                <Button 
                  variant="text" 
                  color="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedLevel('all');
                    setSelectedType('all');
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
                  Chargement des cours...
                </Typography>
              </Box>
            )}
            
            {/* No Results Message */}
            {!loading && filteredCourses.length === 0 && (
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
                  Aucun cours ne correspond à vos critères
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
                    setSelectedType('all');
                    setSortBy('popular');
                  }}
                  sx={{ 
                    bgcolor: theme.palette.primary.main, 
                    color: darkMode ? darkMode : '#0a0e17',
                  }}
                >
                  Voir tous les cours
                </Button>
              </Paper>
            )}
            
            {/* Courses Grid */}
            {!loading && filteredCourses.length > 0 && (
              <Grid container spacing={3}>
                {currentCourses.map((course) => (
                  <Grid item key={course.id} xs={12} sm={6} md={4}>
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
                      <CardMedia
                        component="img"
                        height="160"
                        image={course.image}
                        alt={course.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      
                      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
                          <Chip 
                            size="small" 
                            label={course.level} 
                            sx={{ 
                              bgcolor: 'rgba(255,153,0,0.1)', 
                              color: theme.palette.primary.main,
                              fontWeight: 'medium'
                            }} 
                          />
                          <Chip 
                            size="small" 
                            icon={getCourseTypeIcon(course.type)} 
                            label={course.type === 'video' ? 'Vidéo' : course.type === 'article' ? 'Article' : 'Quiz'} 
                            sx={{ 
                              bgcolor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                              fontWeight: 'medium'
                            }} 
                          />
                        </Box>
                        
                        <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                          {course.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                          {course.description.length > 100 
                            ? `${course.description.substring(0, 100)}...` 
                            : course.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <StarIcon sx={{ fontSize: '1rem', mr: 0.5, color: theme.palette.primary.main }} />
                            <Typography variant="body2" fontWeight="bold">
                              {course.rating.toFixed(1)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            ({course.reviews} avis)
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.primary" sx={{ mt: 1, fontWeight: 'medium' }}>
                          Module: {course.moduleName}
                        </Typography>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ fontSize: '0.85rem', mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {course.duration}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary">
                            {course.instructor}
                          </Typography>
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
                          to={`/courses/${course.id}`}
                        >
                          Détails du cours
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Pagination */}
            {!loading && filteredCourses.length > coursesPerPage && (
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
            
            {/* CTA Section */}
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
                    Accédez à tous nos cours et parcours d'apprentissage personnalisés en vous inscrivant dès aujourd'hui.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button 
                      variant="contained"
                      sx={{ 
                        bgcolor: theme.palette.primary.main, 
                        color: darkMode ? darkMode : '#0a0e17',
                        px: 3,
                        py: 1
                      }}
                      component={Link}
                      to="/register"
                    >
                      S'inscrire gratuitement
                    </Button>
                    <Button 
                      variant="outlined"
                      sx={{ 
                        borderColor: theme.palette.primary.main, 
                        color: theme.palette.primary.main,
                        px: 3,
                        py: 1
                      }}
                      component={Link}
                      to="/pricing"
                    >
                      Voir les offres premium
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Box
                    component="img"
                    src="/images/learning-illustration.svg"
                    alt="Apprentissage en ligne"
                    sx={{ width: '100%', maxWidth: '300px', display: 'block', mx: 'auto' }}
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
                  <Link to="/modules" style={{ color: 'text.secondary', textDecoration: 'none' }}>Modules</Link>
                  <Link to="/courses" style={{ color: theme.palette.primary.main, textDecoration: 'none' }}>Cours</Link>
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

export default Courses;