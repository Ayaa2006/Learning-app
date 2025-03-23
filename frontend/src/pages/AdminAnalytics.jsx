// src/pages/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  CircularProgress,
  Divider,
  Button,
  TextField,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import AdminLayout from '../components/layouts/AdminLayout';
import { useAuth } from '../contexts/AuthContext';

// Données simulées pour les statistiques
const mockData = {
  // Statistiques globales
  generalStats: {
    totalStudents: 1874,
    activeStudents: 1432,
    completedModules: 3789,
    issuedCertificates: 765,
    averageScore: 76.4,
    courseCompletionRate: 68.2
  },
  
  // Engagement des étudiants par mois
  studentEngagement: [
    { month: 'Jan', active: 980, completed: 120, new: 210 },
    { month: 'Fév', active: 1050, completed: 145, new: 190 },
    { month: 'Mar', active: 1120, completed: 180, new: 230 },
    { month: 'Avr', active: 1200, completed: 210, new: 250 },
    { month: 'Mai', active: 1330, completed: 240, new: 190 },
    { month: 'Juin', active: 1432, completed: 290, new: 170 }
  ],
  
  // Taux de complétion par module
  moduleCompletion: [
    { name: 'Introduction à JavaScript', students: 354, completion: 92 },
    { name: 'JavaScript Avancé', students: 287, completion: 78 },
    { name: 'Frameworks Frontend', students: 312, completion: 65 },
    { name: 'Développement Backend', students: 245, completion: 58 },
    { name: 'Bases de Données', students: 198, completion: 72 },
    { name: 'Architecture Web', students: 176, completion: 62 }
  ],
  
  // Distribution des notes aux examens
  examScores: [
    { range: '0-20%', count: 28 },
    { range: '21-40%', count: 46 },
    { range: '41-60%', count: 124 },
    { range: '61-80%', count: 432 },
    { range: '81-100%', count: 278 }
  ],
  
  // Tentatives de triche
  cheatAttempts: [
    { month: 'Jan', count: 12 },
    { month: 'Fév', count: 8 },
    { month: 'Mar', count: 15 },
    { month: 'Avr', count: 10 },
    { month: 'Mai', count: 6 },
    { month: 'Juin', count: 9 }
  ],
  
  // Types de triche
  cheatTypes: [
    { name: 'Absence de visage', value: 42 },
    { name: 'Plusieurs visages', value: 18 },
    { name: 'Sortie de fenêtre', value: 32 },
    { name: 'Activité suspecte', value: 8 }
  ],
  
  // Performance par compétence
  skillPerformance: [
    { subject: 'Variables', score: 85 },
    { subject: 'Fonctions', score: 78 },
    { subject: 'DOM', score: 65 },
    { subject: 'API', score: 72 },
    { subject: 'Async', score: 58 },
    { subject: 'Sécurité', score: 64 }
  ],
  
  // Sessions par appareil
  deviceUsage: [
    { name: 'Ordinateur', value: 68 },
    { name: 'Tablette', value: 17 },
    { name: 'Mobile', value: 15 }
  ],
  
  // Temps moyen par module en minutes
  moduleTimeSpent: [
    { name: 'Introduction à JavaScript', time: 45 },
    { name: 'JavaScript Avancé', time: 78 },
    { name: 'Frameworks Frontend', time: 92 },
    { name: 'Développement Backend', time: 104 },
    { name: 'Bases de Données', time: 68 },
    { name: 'Architecture Web', time: 83 }
  ]
};

// Couleurs pour les graphiques
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminAnalytics = ({ darkMode, toggleDarkMode }) => {
  const { userRole, hasPermission, ROLES } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [data, setData] = useState(null);
  
  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Filtrer les données par role si nécessaire
        let filteredData = mockData;
        
        // Si c'est un professeur, on pourrait filtrer pour ne montrer que les modules assignés
        if (userRole === ROLES.TEACHER) {
          // Simuler que le professeur est assigné à certains modules spécifiques
          const assignedModules = ['Introduction à JavaScript', 'JavaScript Avancé'];
          
          filteredData = {
            ...mockData,
            moduleCompletion: mockData.moduleCompletion.filter(module => 
              assignedModules.includes(module.name)
            ),
            moduleTimeSpent: mockData.moduleTimeSpent.filter(module => 
              assignedModules.includes(module.name)
            )
          };
        }
        
        setData(filteredData);
      } catch (error) {
        console.error("Erreur lors du chargement des données statistiques:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userRole, ROLES]);
  
  // Changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Changement de plage de temps
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  // Changement de filtre de module
  const handleModuleFilterChange = (event) => {
    setModuleFilter(event.target.value);
  };
// Ajouter cette fonction dans le composant AdminAnalytics
const handleApplyFilters = () => {
    setLoading(true);
    
    // Simuler un temps de chargement
    setTimeout(() => {
      // Filtrer les données selon timeRange et moduleFilter
      let filteredData = {...mockData};
      
      // Si un module spécifique est sélectionné
      if (moduleFilter !== 'all') {
        filteredData.moduleCompletion = mockData.moduleCompletion.filter(
          module => module.name === moduleFilter
        );
        filteredData.moduleTimeSpent = mockData.moduleTimeSpent.filter(
          module => module.name === moduleFilter
        );
        
        // Adapter d'autres données si nécessaire
      }
      
      // Filtrer par période de temps
      // (ici vous pourriez ajuster les données studentEngagement, etc.)
      
      setData(filteredData);
      setLoading(false);
    }, 500);
  };
  
  // Formater les nombres avec séparateur de milliers
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  // Calculer le pourcentage avec une couleur associée
  const getPercentageColor = (percentage) => {
    if (percentage >= 75) return '#4caf50'; // Vert
    if (percentage >= 50) return '#ff9800'; // Orange
    return '#f44336'; // Rouge
  };
  
  return (
    <AdminLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
      <Box sx={{ py: 4, bgcolor: darkMode ? 'background.default' : '#f5f7fb', minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
            Statistiques et Analyses
          </Typography>
          
          {/* Filtres */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Période</InputLabel>
                  <Select
                    value={timeRange}
                    onChange={handleTimeRangeChange}
                    label="Période"
                  >
                    <MenuItem value="30days">30 derniers jours</MenuItem>
                    <MenuItem value="3months">3 derniers mois</MenuItem>
                    <MenuItem value="6months">6 derniers mois</MenuItem>
                    <MenuItem value="1year">1 an</MenuItem>
                    <MenuItem value="all">Toutes les données</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Module</InputLabel>
                  <Select
                    value={moduleFilter}
                    onChange={handleModuleFilterChange}
                    label="Module"
                  >
                    <MenuItem value="all">Tous les modules</MenuItem>
                    {data && data.moduleCompletion.map((module, index) => (
                      <MenuItem key={index} value={module.name}>
                        {module.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
              <Button 
  variant="contained" 
  fullWidth
  onClick={handleApplyFilters}
  sx={{ 
    bgcolor: '#ff9900', 
    '&:hover': { bgcolor: '#e68a00' },
    py: 1.5
  }}
>
  Appliquer les filtres
</Button>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Onglets */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              mb: 3,
              '& .MuiTab-root': { py: 2 },
              '& .Mui-selected': { color: '#ff9900' },
              '& .MuiTabs-indicator': { bgcolor: '#ff9900' }
            }}
          >
            <Tab label="Vue d'ensemble" />
            <Tab label="Performances des étudiants" />
            <Tab label="Modules et Cours" />
            <Tab label="Examens et Certification" />
            {hasPermission('viewCheatDetection') && <Tab label="Détection de triche" />}
            <Tab label="Tendances" />
          </Tabs>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#ff9900' }} />
            </Box>
          ) : data ? (
            <>
              {/* Vue d'ensemble */}
              {tabValue === 0 && (
                <Box>
                  {/* Statistiques clés */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Étudiants
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Total
                              </Typography>
                              <Typography variant="h5" fontWeight="bold">
                                {formatNumber(data.generalStats.totalStudents)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Actifs
                              </Typography>
                              <Typography variant="h5" fontWeight="bold">
                                {formatNumber(data.generalStats.activeStudents)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Taux d'activité
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                                    <Box sx={{ 
                                      height: 6, 
                                      bgcolor: '#e0e0e0', 
                                      borderRadius: 3,
                                      position: 'relative',
                                      overflow: 'hidden'
                                    }}>
                                      <Box 
                                        sx={{ 
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          height: '100%',
                                          width: `${(data.generalStats.activeStudents / data.generalStats.totalStudents) * 100}%`,
                                          bgcolor: '#4caf50',
                                          borderRadius: 3
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {Math.round((data.generalStats.activeStudents / data.generalStats.totalStudents) * 100)}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Modules
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Complétés
                              </Typography>
                              <Typography variant="h5" fontWeight="bold">
                                {formatNumber(data.generalStats.completedModules)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Taux de complétion
                              </Typography>
                              <Typography variant="h5" fontWeight="bold">
                                {data.generalStats.courseCompletionRate}%
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Progression
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                                    <Box sx={{ 
                                      height: 6, 
                                      bgcolor: '#e0e0e0', 
                                      borderRadius: 3,
                                      position: 'relative',
                                      overflow: 'hidden'
                                    }}>
                                      <Box 
                                        sx={{ 
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          height: '100%',
                                          width: `${data.generalStats.courseCompletionRate}%`,
                                          bgcolor: getPercentageColor(data.generalStats.courseCompletionRate),
                                          borderRadius: 3
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {data.generalStats.courseCompletionRate}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Certification
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Certificats émis
                              </Typography>
                              <Typography variant="h5" fontWeight="bold">
                                {formatNumber(data.generalStats.issuedCertificates)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">
                                Score moyen
                              </Typography>
                              <Typography variant="h5" fontWeight="bold">
                                {data.generalStats.averageScore}%
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  Taux de certification
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                                    <Box sx={{ 
                                      height: 6, 
                                      bgcolor: '#e0e0e0', 
                                      borderRadius: 3,
                                      position: 'relative',
                                      overflow: 'hidden'
                                    }}>
                                      <Box 
                                        sx={{ 
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          height: '100%',
                                          width: `${(data.generalStats.issuedCertificates / data.generalStats.totalStudents) * 100}%`,
                                          bgcolor: '#673ab7',
                                          borderRadius: 3
                                        }}
                                      />
                                    </Box>
                                  </Box>
                                  <Typography variant="body2" fontWeight="bold">
                                    {Math.round((data.generalStats.issuedCertificates / data.generalStats.totalStudents) * 100)}%
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  {/* Graphiques d'aperçu */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Engagement des étudiants
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={data.studentEngagement}
                              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Area type="monotone" dataKey="active" stackId="1" stroke="#8884d8" fill="#8884d8" />
                              <Area type="monotone" dataKey="new" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                              <Area type="monotone" dataKey="completed" stackId="1" stroke="#ffc658" fill="#ffc658" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Utilisation par appareil
                        </Typography>
                        <Box sx={{ height: 350, mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data.deviceUsage}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {data.deviceUsage.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Performance des étudiants */}
              {tabValue === 1 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Distribution des scores aux examens
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={data.examScores}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="range" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="count" name="Nombre d'étudiants" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Performance par compétence
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart outerRadius={90} data={data.skillPerformance}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              <Radar name="Score moyen" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                              <Legend />
                            </RadarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Modules et Cours */}
              {tabValue === 2 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Taux de complétion par module
                        </Typography>
                        <Box sx={{ height: 400, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={data.moduleCompletion}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              layout="vertical"
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" domain={[0, 100]} />
                              <YAxis type="category" dataKey="name" width={150} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="completion" name="Taux de complétion (%)" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Temps moyen par module
                        </Typography>
                        <Box sx={{ height: 400, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={data.moduleTimeSpent}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" tick={false} />
                              <YAxis label={{ value: 'Temps (minutes)', angle: -90, position: 'insideLeft' }} />
                              <Tooltip formatter={(value, name) => [`${value} min`, 'Temps moyen']} labelFormatter={(value) => data.moduleTimeSpent.find(item => item.name === value)?.name} />
                              <Legend />
                              <Bar dataKey="time" name="Temps moyen (min)" fill="#82ca9d" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Examens et Certification */}
              {tabValue === 3 && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Certificats émis par mois
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={data.studentEngagement}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="completed" name="Certificats émis" stroke="#673ab7" activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Nombre de tentatives par examen
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 10 }}>
                            Données non disponibles pour la période sélectionnée
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Détection de triche */}
              {tabValue === 4 && hasPermission('viewCheatDetection') && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Incidents de triche par mois
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={data.cheatAttempts}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="count" name="Nombre d'incidents" fill="#f44336" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Types d'incidents
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data.cheatTypes}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {data.cheatTypes.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Mesures de prévention
                        </Typography>
                        <Alert severity="info" sx={{ mt: 2 }}>
                          Basé sur les données d'incidents, voici quelques recommandations pour réduire les tentatives de triche.
                        </Alert>
                        <Box sx={{ mt: 3 }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Absence de visage
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Ajustez la sensibilité de la détection et informez les étudiants de rester visibles pendant toute la durée de l'examen.
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Sortie de fenêtre
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Informez clairement les étudiants des règles avant l'examen et envoyez des avertissements automatiques.
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Card variant="outlined" sx={{ height: '100%' }}>
                                <CardContent>
                                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Plusieurs visages
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Encouragez les étudiants à passer les examens dans un environnement isolé et calme.
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          </Grid>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {/* Tendances */}
              {tabValue === 5 || (tabValue === 4 && !hasPermission('viewCheatDetection')) && (
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Tendances d'engagement
                        </Typography>
                        <Box sx={{ height: 400, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={data.studentEngagement}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="active" name="Étudiants actifs" stroke="#8884d8" />
                              <Line type="monotone" dataKey="completed" name="Modules complétés" stroke="#82ca9d" />
                              <Line type="monotone" dataKey="new" name="Nouveaux étudiants" stroke="#ffc658" />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Modules les plus populaires
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={data.moduleCompletion.sort((a, b) => b.students - a.students).slice(0, 5)}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="students" name="Nombre d'étudiants" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          Prévisions d'inscription
                        </Typography>
                        <Box sx={{ height: 350, mt: 2 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={[
                                { month: 'Juil', étudiants: 190, prévision: 195 },
                                { month: 'Août', étudiants: 0, prévision: 210 },
                                { month: 'Sep', étudiants: 0, prévision: 280 },
                                { month: 'Oct', étudiants: 0, prévision: 250 },
                                { month: 'Nov', étudiants: 0, prévision: 230 },
                                { month: 'Déc', étudiants: 0, prévision: 220 }
                              ]}
                              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="étudiants" name="Étudiants réels" stroke="#8884d8" />
                              <Line type="monotone" dataKey="prévision" name="Prévision" stroke="#82ca9d" strokeDasharray="5 5" />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          ) : (
            <Alert severity="error" sx={{ mt: 2 }}>
              Erreur lors du chargement des données. Veuillez réessayer ultérieurement.
            </Alert>
          )}
        </Container>
      </Box>
    </AdminLayout>
  );
};

export default AdminAnalytics;