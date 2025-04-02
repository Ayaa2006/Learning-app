// src/pages/AdminQCM.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Alert,
  Menu,
  MenuItem,
  Tooltip,
  Badge
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Delete as DeleteIcon, 
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assessment as AssessmentIcon,
  FilterList as FilterListIcon,
  GetApp as GetAppIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Report as ReportIcon
} from '@mui/icons-material';

// Données fictives pour les QCM
const mockQCMs = [
  {
    id: 1,
    courseId: 1,
    title: "QCM: Variables et Types",
    author: "Jean Dupont",
    authorRole: "Professeur",
    publié: true,
    lastUpdated: "12/03/2025",
    completions: 157,
    averageScore: 82,
    signalements: 0,
    questions: [
      {
        id: 1,
        text: "Quel type de variable est utilisé pour stocker des nombres entiers en JavaScript?",
        options: [
          { id: 1, text: "String", isCorrect: false },
          { id: 2, text: "Float", isCorrect: false },
          { id: 3, text: "Number", isCorrect: true },
          { id: 4, text: "Integer", isCorrect: false }
        ],
        type: "single",
        accuracy: 78
      },
      {
        id: 2,
        text: "Quelles sont les bonnes pratiques pour nommer les variables? (plusieurs réponses possibles)",
        options: [
          { id: 1, text: "Utiliser le camelCase", isCorrect: true },
          { id: 2, text: "Commencer par un chiffre", isCorrect: false },
          { id: 3, text: "Utiliser des noms descriptifs", isCorrect: true },
          { id: 4, text: "Utiliser des caractères spéciaux comme @ ou #", isCorrect: false }
        ],
        type: "multiple",
        accuracy: 65
      }
    ]
  },
  {
    id: 2,
    courseId: 2,
    title: "QCM: Structures Conditionnelles",
    author: "Marie Martin",
    authorRole: "Professeur",
    publié: true,
    lastUpdated: "28/03/2025",
    completions: 124,
    averageScore: 73,
    signalements: 2,
    questions: [
      {
        id: 1,
        text: "Quelle condition sera évaluée comme vraie?",
        options: [
          { id: 1, text: "if(0)", isCorrect: false },
          { id: 2, text: "if('')", isCorrect: false },
          { id: 3, text: "if(1)", isCorrect: true },
          { id: 4, text: "if(null)", isCorrect: false }
        ],
        type: "single",
        accuracy: 81
      }
    ]
  },
  {
    id: 3,
    courseId: 3,
    title: "QCM: Boucles et Itérations",
    author: "Sophie Legrand",
    authorRole: "Professeur",
    publié: true,
    lastUpdated: "01/04/2025",
    completions: 98,
    averageScore: 68,
    signalements: 5,
    questions: [
      {
        id: 1,
        text: "Quelle boucle est la plus appropriée pour un nombre fixe d'itérations?",
        options: [
          { id: 1, text: "for", isCorrect: true },
          { id: 2, text: "while", isCorrect: false },
          { id: 3, text: "do-while", isCorrect: false },
          { id: 4, text: "forEach", isCorrect: false }
        ],
        type: "single",
        accuracy: 65
      }
    ]
  }
];

// Données fictives pour les statistiques globales
const globalStats = {
  totalQCMs: 47,
  totalCompletions: 4328,
  averageScoreGlobal: 76,
  totalQuestions: 218,
  questionsPerQCM: 4.6,
  mostActiveMonth: "Mars 2025",
  mostActiveTeacher: "Jean Dupont",
  weakestSubject: "Programmation orientée objet",
  recentSignalements: [
    { 
      id: 1, 
      qcmTitle: "QCM: Boucles et Itérations", 
      studentName: "Thomas Bernard", 
      date: "02/04/2025", 
      reason: "Question ambiguë" 
    },
    { 
      id: 2, 
      qcmTitle: "QCM: Structures Conditionnelles", 
      studentName: "Laura Michel", 
      date: "30/03/2025", 
      reason: "Réponse incorrecte" 
    }
  ]
};

const AdminQCM = () => {
  const [tabValue, setTabValue] = useState(0);
  const [qcms, setQCMs] = useState(mockQCMs);
  const [selectedQCM, setSelectedQCM] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [anchorElFilter, setAnchorElFilter] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSelectQCM = (qcm) => {
    setSelectedQCM(qcm);
    setCurrentQuestion(qcm.questions[0] || null);
  };
  
  const handleSelectQuestion = (question) => {
    setCurrentQuestion(question);
  };
  
  const handleDeleteQCM = (qcmId) => {
    setQCMs(qcms.filter(q => q.id !== qcmId));
    if (selectedQCM && selectedQCM.id === qcmId) {
      setSelectedQCM(null);
      setCurrentQuestion(null);
    }
  };
  
  const handleOpenFilterMenu = (event) => {
    setAnchorElFilter(event.currentTarget);
  };
  
  const handleCloseFilterMenu = () => {
    setAnchorElFilter(null);
  };
  
  const handleSetSort = (sortType) => {
    setSortBy(sortType);
    handleCloseFilterMenu();
  };
  
  const getSortedQCMs = () => {
    switch(sortBy) {
      case 'recent':
        return [...qcms].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      case 'popularity':
        return [...qcms].sort((a, b) => b.completions - a.completions);
      case 'score':
        return [...qcms].sort((a, b) => b.averageScore - a.averageScore);
      case 'signalements':
        return [...qcms].sort((a, b) => b.signalements - a.signalements);
      default:
        return qcms;
    }
  };
  
  // Fonction pour générer un rapport détaillé sur un QCM
  const generateQCMReport = (qcm) => {
    console.log(`Génération du rapport pour le QCM: ${qcm.title}`);
    // Simulation d'une génération de rapport
    alert(`Rapport pour "${qcm.title}" généré avec succès! Le rapport a été envoyé à votre email.`);
  };

  // Fonction pour exporter la liste des QCM
  const exportQCMList = () => {
    console.log("Exportation de la liste des QCM");
    // Simulation d'un export
    alert("Liste des QCM exportée avec succès! Le fichier a été téléchargé.");
  };

  // Fonction pour gérer les signalements
  const handleManageReports = () => {
    console.log("Ouverture de la gestion des signalements");
    // Redirection vers une page dédiée
    alert("Redirection vers la page de gestion des signalements...");
  };

  return (
    <Box sx={{ py: 4, bgcolor: '#f5f7fb', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Surveillance des QCM
        </Typography>
        
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': { py: 2 },
              '& .Mui-selected': { color: '#ff9900' },
              '& .MuiTabs-indicator': { bgcolor: '#ff9900' }
            }}
          >
            <Tab label="Liste des QCM" />
            <Tab label="Analyse détaillée" />
            <Tab label="Statistiques globales" />
          </Tabs>
          
          <Box sx={{ p: 0 }}>
            {/* Onglet Liste des QCM */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="h2">
                    Tous les QCM ({qcms.length})
                  </Typography>
                  
                  <Box>
                    <Button
                      variant="outlined"
                      startIcon={<FilterListIcon />}
                      onClick={handleOpenFilterMenu}
                      sx={{ mr: 2 }}
                    >
                      Trier: {sortBy === 'recent' ? 'Récents' : 
                             sortBy === 'popularity' ? 'Popularité' : 
                             sortBy === 'score' ? 'Score' : 'Signalements'}
                    </Button>
                    <Menu
                      anchorEl={anchorElFilter}
                      open={Boolean(anchorElFilter)}
                      onClose={handleCloseFilterMenu}
                    >
                      <MenuItem onClick={() => handleSetSort('recent')}>Récents</MenuItem>
                      <MenuItem onClick={() => handleSetSort('popularity')}>Popularité</MenuItem>
                      <MenuItem onClick={() => handleSetSort('score')}>Score</MenuItem>
                      <MenuItem onClick={() => handleSetSort('signalements')}>Signalements</MenuItem>
                    </Menu>
                    
                    <Button 
                      variant="contained" 
                      startIcon={<GetAppIcon />}
                      onClick={exportQCMList}
                      sx={{ 
                        bgcolor: '#4caf50', 
                        '&:hover': { bgcolor: '#388e3c' } 
                      }}
                    >
                      Exporter
                    </Button>
                  </Box>
                </Box>
                
                <List>
                  {getSortedQCMs().map((qcm) => (
                    <React.Fragment key={qcm.id}>
                      <ListItem 
                        button 
                        onClick={() => handleSelectQCM(qcm)}
                        selected={selectedQCM && selectedQCM.id === qcm.id}
                        sx={{ 
                          borderRadius: 1,
                          bgcolor: qcm.signalements > 3 ? 'rgba(244, 67, 54, 0.08)' : 'transparent'
                        }}
                      >
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {qcm.title}
                              {qcm.signalements > 3 && (
                                <Tooltip title={`${qcm.signalements} signalements`}>
                                  <Chip 
                                    icon={<FlagIcon />} 
                                    label={qcm.signalements} 
                                    color="error" 
                                    size="small" 
                                    sx={{ ml: 1 }}
                                  />
                                </Tooltip>
                              )}
                            </Box>
                          } 
                          secondary={`Auteur: ${qcm.author} • Modifié le: ${qcm.lastUpdated} • ${qcm.questions.length} questions • Score moyen: ${qcm.averageScore}%`} 
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                          <Tooltip title="Nombre de complétions">
                            <Chip 
                              label={`${qcm.completions} complétions`} 
                              color="primary" 
                              variant="outlined" 
                              size="small" 
                              sx={{ mr: 2 }}
                            />
                          </Tooltip>
                          <IconButton color="primary" sx={{ mr: 1 }}>
                            <VisibilityIcon />
                          </IconButton>
                          <Tooltip title="Supprimer ce QCM">
                            <IconButton 
                              color="error" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteQCM(qcm.id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
            
            {/* Onglet Analyse détaillée */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                {selectedQCM ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box>
                        <Typography variant="h5" component="h2">
                          {selectedQCM.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Auteur: {selectedQCM.author} • Dernière mise à jour: {selectedQCM.lastUpdated}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Button 
                          variant="outlined"
                          startIcon={<AssessmentIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => generateQCMReport(selectedQCM)}
                        >
                          Rapport détaillé
                        </Button>
                        {selectedQCM.signalements > 0 && (
                          <Chip 
                            icon={<FlagIcon />} 
                            label={`${selectedQCM.signalements} signalements`} 
                            color="error" 
                            sx={{ mr: 2 }}
                          />
                        )}
                      </Box>
                    </Box>
                    
                    {selectedQCM.signalements > 3 && (
                      <Alert severity="warning" sx={{ mb: 3 }}>
                        Ce QCM a reçu plusieurs signalements de la part des étudiants. Nous vous recommandons de l'examiner en détail.
                      </Alert>
                    )}
                    
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                          Statistiques du QCM
                        </Typography>
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                          <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">
                                Complétions
                              </Typography>
                              <Typography variant="h4">
                                {selectedQCM.completions}
                              </Typography>
                            </CardContent>
                          </Card>
                          <Card variant="outlined" sx={{ mb: 2 }}>
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">
                                Score moyen
                              </Typography>
                              <Typography variant="h4">
                                {selectedQCM.averageScore}%
                              </Typography>
                            </CardContent>
                          </Card>
                          <Card variant="outlined">
                            <CardContent>
                              <Typography variant="subtitle2" color="text.secondary">
                                Taux de difficulté
                              </Typography>
                              <Typography variant="h4">
                                {selectedQCM.averageScore < 60 ? 'Élevé' : selectedQCM.averageScore < 80 ? 'Moyen' : 'Faible'}
                              </Typography>
                            </CardContent>
                          </Card>
                          
                          <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                            Questions ({selectedQCM.questions.length})
                          </Typography>
                          <List sx={{ maxHeight: 250, overflow: 'auto' }}>
                            {selectedQCM.questions.map((question) => (
                              <React.Fragment key={question.id}>
                                <ListItem 
                                  button 
                                  onClick={() => handleSelectQuestion(question)}
                                  selected={currentQuestion && currentQuestion.id === question.id}
                                >
                                  <ListItemText 
                                    primary={question.text.length > 30 ? `${question.text.substring(0, 30)}...` : question.text} 
                                    secondary={`Taux de réussite: ${question.accuracy}%`} 
                                  />
                                </ListItem>
                                <Divider component="li" />
                              </React.Fragment>
                            ))}
                          </List>
                        </Paper>
                      </Grid>
                      
                      <Grid item xs={12} md={8}>
                        {currentQuestion ? (
                          <Box>
                            <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                              Analyse de la question
                            </Typography>
                            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                              <Box>
                                <Typography variant="h6" gutterBottom>
                                  {currentQuestion.text}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Type: {currentQuestion.type === 'single' ? 'Choix unique' : 'Choix multiple'} • Taux de réussite: {currentQuestion.accuracy}%
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <List>
                                  {currentQuestion.options.map((option) => (
                                    <ListItem key={option.id}>
                                      {option.isCorrect ? (
                                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                                      ) : (
                                        <CancelIcon color="error" sx={{ mr: 1 }} />
                                      )}
                                      <ListItemText 
                                        primary={option.text} 
                                        secondary={`${Math.floor(Math.random() * 45 + 5)}% des étudiants ont choisi cette option`} 
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                                
                                <Box sx={{ mt: 3 }}>
                                  <Typography variant="subtitle1" gutterBottom>
                                    Analyse de performance
                                  </Typography>
                                  <Card variant="outlined" sx={{ mb: 2, p: 1 }}>
                                    <CardContent>
                                      <Typography variant="body2">
                                        {currentQuestion.accuracy < 50 
                                          ? "Cette question semble trop difficile. Envisagez de contacter l'auteur pour une clarification." 
                                          : currentQuestion.accuracy > 90 
                                          ? "Cette question est très facile. Elle pourrait ne pas être suffisamment discriminante."
                                          : "Cette question a un bon niveau de difficulté équilibré."
                                        }
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Box>
                              </Box>
                            </Paper>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography variant="subtitle1" color="text.secondary">
                              Sélectionnez une question pour voir son analyse détaillée
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Sélectionnez un QCM dans l'onglet "Liste des QCM" pour voir son analyse détaillée
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Onglet Statistiques globales */}
            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography variant="h6" component="h3">
                        Tableau de bord global
                      </Typography>
                      <Button 
                        variant="contained" 
                        startIcon={<GetAppIcon />}
                        onClick={exportQCMList}
                        sx={{ 
                          bgcolor: '#4caf50', 
                          '&:hover': { bgcolor: '#388e3c' } 
                        }}
                      >
                        Exporter les statistiques
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          QCM Total
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                          {globalStats.totalQCMs}
                        </Typography>
                        <Chip 
                          label="+8 ce mois" 
                          color="success" 
                          size="small" 
                          variant="outlined" 
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Complétions totales
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                          {globalStats.totalCompletions}
                        </Typography>
                        <Chip 
                          label="+432 ce mois" 
                          color="success" 
                          size="small" 
                          variant="outlined" 
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Score moyen global
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                          {globalStats.averageScoreGlobal}%
                        </Typography>
                        <Chip 
                          label="+2% vs trimestre précédent" 
                          color="primary" 
                          size="small" 
                          variant="outlined" 
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary">
                          Signalements actifs
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1, mb: 1 }}>
                          {globalStats.recentSignalements.length}
                        </Typography>
                        <Chip 
                          label="Requiert votre attention" 
                          color="warning" 
                          size="small" 
                          variant="outlined" 
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={8}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                        Tendances et performance
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <BarChartIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography variant="subtitle1">
                                  Activité par mois
                                </Typography>
                              </Box>
                              <Box sx={{ height: 150, bgcolor: '#f5f5f5', borderRadius: 1, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Graphique: activité mensuelle
                                </Typography>
                              </Box>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                  Mois le plus actif: <strong>{globalStats.mostActiveMonth}</strong>
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <PieChartIcon sx={{ color: 'primary.main', mr: 1 }} />
                                <Typography variant="subtitle1">
                                  Distribution par matière
                                </Typography>
                              </Box>
                              <Box sx={{ height: 150, bgcolor: '#f5f5f5', borderRadius: 1, p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                  Graphique: distribution par matière
                                </Typography>
                              </Box>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                  Sujet avec le score le plus bas: <strong>{globalStats.weakestSubject}</strong>
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle1" sx={{ mb: 2 }}>
                          Insights clés
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="body2">
                                  <strong>Professeur le plus actif:</strong> {globalStats.mostActiveTeacher}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="body2">
                                  <strong>Questions par QCM:</strong> {globalStats.questionsPerQCM} en moyenne
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                              <CardContent>
                                <Typography variant="body2">
                                  <strong>Total de questions:</strong> {globalStats.totalQuestions}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        </Grid>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FlagIcon color="error" sx={{ mr: 1 }} />
                        Signalements récents
                      </Typography>
                      {globalStats.recentSignalements.length > 0 ? (
                        <List>
                          {globalStats.recentSignalements.map((signalement) => (
                            <React.Fragment key={signalement.id}>
                              <ListItem>
                                <ListItemText 
                                  primary={signalement.qcmTitle} 
                                  secondary={
                                    <Box>
                                      <Typography variant="body2" component="span">
                                        Signalé par: {signalement.studentName}
                                      </Typography>
                                      <br />
                                      <Typography variant="body2" component="span">
                                        Date: {signalement.date} • Raison: {signalement.reason}
                                      </Typography>
                                    </Box>
                                  } 
                                />
                                <Tooltip title="Voir les détails">
                                  <IconButton size="small" color="primary">
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </ListItem>
                              <Divider component="li" />
                            </React.Fragment>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            Aucun signalement récent
                          </Typography>
                        </Box>
                      )}
                      
                      <Button 
                        variant="outlined" 
                        color="error"
                        startIcon={<ReportIcon />}
                        fullWidth
                        onClick={handleManageReports}
                        sx={{ mt: 2 }}
                      >
                        Gérer tous les signalements
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

// Fonction utilitaire pour générer des pourcentages aléatoires pour l'affichage des graphiques (simulation)
const generateRandomPercentages = (count) => {
  const percentages = [];
  let remaining = 100;
  
  for (let i = 0; i < count - 1; i++) {
    // Générer un pourcentage aléatoire en fonction du reste disponible
    const max = Math.floor(remaining * 0.8); // Ne pas prendre plus de 80% du reste
    const percentage = Math.floor(Math.random() * max) + 1;
    percentages.push(percentage);
    remaining -= percentage;
  }
  
  // Ajouter le reste au dernier élément
  percentages.push(remaining);
  
  return percentages;
};

export default AdminQCM;