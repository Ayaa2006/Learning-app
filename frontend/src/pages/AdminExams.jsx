// src/pages/AdminExams.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { mockExams, mockModules, mockCheatAttempts } from '../data/mockData';

const AdminExams = () => {
  const [exams, setExams] = useState(mockExams);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentExam, setCurrentExam] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleOpen = (exam = null) => {
    setCurrentExam(exam);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const getStatusColor = (passed, failed, pending) => {
    if (pending > 0) return 'warning';
    if (failed > passed) return 'error';
    return 'success';
  };
  
  const getStatusText = (passed, failed, pending) => {
    if (pending > 0) return 'En cours';
    if (failed > passed) return 'Faible taux de réussite';
    return 'Bonne progression';
  };
  
  return (
    <Box sx={{ py: 4, bgcolor: '#f5f7fb', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Gestion des Examens
        </Typography>
        
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }}>
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
            <Tab label="Liste des Examens" />
            <Tab label="Détection de Triche" />
            <Tab label="Paramètres" />
          </Tabs>
          
          <Box sx={{ p: 0 }}>
            {/* Onglet Liste des Examens */}
            {tabValue === 0 && (
              <Box sx={{ p: 3 }}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => handleOpen(null)}
                  sx={{ 
                    mb: 3,
                    bgcolor: '#ff9900', 
                    '&:hover': { bgcolor: '#e68a00' } 
                  }}
                >
                  Nouvel Examen
                </Button>
                
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Titre</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Module</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total Étudiants</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Réussis</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Échoués</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>En attente</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Score Moyen</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Statut</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exams.map((exam) => (
                        <TableRow key={exam.id}>
                          <TableCell>{exam.id}</TableCell>
                          <TableCell>{exam.title}</TableCell>
                          <TableCell>
                            {mockModules.find(m => m.id === exam.moduleId)?.title || "Module inconnu"}
                          </TableCell>
                          <TableCell>{exam.totalStudents}</TableCell>
                          <TableCell>{exam.passed}</TableCell>
                          <TableCell>{exam.failed}</TableCell>
                          <TableCell>{exam.pending}</TableCell>
                          <TableCell>{`${exam.avgScore}%`}</TableCell>
                          <TableCell>
                            <Chip 
                              label={getStatusText(exam.passed, exam.failed, exam.pending)} 
                              color={getStatusColor(exam.passed, exam.failed, exam.pending)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton 
                              color="primary" 
                              onClick={() => handleOpen(exam)}
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton 
                              color="info" 
                              size="small"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton 
                              color="error" 
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            
            {/* Onglet Détection de Triche */}
            {tabValue === 1 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
                  Incidents de Triche Détectés
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
                      <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Étudiant</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Examen</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Type d'incident</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {mockCheatAttempts.map((attempt) => (
                            <TableRow key={attempt.id}>
                              <TableCell>{attempt.id}</TableCell>
                              <TableCell>{attempt.studentName}</TableCell>
                              <TableCell>{attempt.examTitle}</TableCell>
                              <TableCell>{`${attempt.date} ${attempt.timestamp}`}</TableCell>
                              <TableCell>
                                <Chip 
                                  icon={<WarningIcon />}
                                  label={attempt.type} 
                                  color="error"
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <IconButton 
                                  color="info" 
                                  size="small"
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                        Paramètres de Détection
                      </Typography>
                      
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Détection d'absence de visage" 
                            secondary="Détecte quand l'étudiant n'est pas visible à la caméra"
                          />
                          <Switch defaultChecked />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Détection de plusieurs visages" 
                            secondary="Détecte quand plusieurs personnes sont visibles"
                          />
                          <Switch defaultChecked />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Détection de sortie de fenêtre" 
                            secondary="Détecte quand l'étudiant quitte la fenêtre d'examen"
                          />
                          <Switch defaultChecked />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Tolérance (secondes)" 
                            secondary="Temps autorisé avant de signaler une triche"
                          />
                          <TextField 
                            type="number" 
                            defaultValue={3}
                            InputProps={{ inputProps: { min: 1, max: 10 } }}
                            size="small"
                          />
                        </ListItem>
                      </List>
                      
                      <Button 
                        variant="contained"
                        fullWidth
                        sx={{ 
                          mt: 3,
                          bgcolor: '#ff9900', 
                          '&:hover': { bgcolor: '#e68a00' } 
                        }}
                      >
                        Enregistrer les paramètres
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Onglet Paramètres */}
            {tabValue === 2 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                        Paramètres Généraux des Examens
                      </Typography>
                      
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Note minimale de validation (%)" 
                            secondary="Score minimal requis pour valider un examen"
                          />
                          <TextField 
                            type="number" 
                            defaultValue={70}
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            size="small"
                          />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Nombre max de tentatives" 
                            secondary="Nombre maximal de tentatives par examen"
                          />
                          <TextField 
                            type="number" 
                            defaultValue={3}
                            InputProps={{ inputProps: { min: 1, max: 10 } }}
                            size="small"
                          />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Délai entre tentatives (heures)" 
                            secondary="Temps d'attente entre chaque tentative"
                          />
                          <TextField 
                            type="number" 
                            defaultValue={24}
                            InputProps={{ inputProps: { min: 0, max: 168 } }}
                            size="small"
                          />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Afficher les corrections" 
                            secondary="Montrer les réponses correctes après l'examen"
                          />
                          <Switch defaultChecked />
                        </ListItem>
                      </List>
                      
                      <Button 
                        variant="contained"
                        fullWidth
                        sx={{ 
                          mt: 3,
                          bgcolor: '#ff9900', 
                          '&:hover': { bgcolor: '#e68a00' } 
                        }}
                      >
                        Enregistrer les paramètres
                      </Button>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" component="h3" sx={{ mb: 3 }}>
                        Notifications
                      </Typography>
                      
                      <List>
                        <ListItem>
                          <ListItemText 
                            primary="Notification avant examen" 
                            secondary="Envoyer un rappel avant la date de l'examen"
                          />
                          <Switch defaultChecked />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Délai de notification (heures)" 
                            secondary="Combien de temps avant l'examen"
                          />
                          <TextField 
                            type="number" 
                            defaultValue={24}
                            InputProps={{ inputProps: { min: 1, max: 72 } }}
                            size="small"
                          />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Notification des résultats" 
                            secondary="Envoyer les résultats par email"
                          />
                          <Switch defaultChecked />
                        </ListItem>
                        <Divider component="li" />
                        
                        <ListItem>
                          <ListItemText 
                            primary="Notification de triche" 
                            secondary="Alerter l'admin en cas de triche détectée"
                          />
                          <Switch defaultChecked />
                        </ListItem>
                      </List>
                      
                      <Button 
                        variant="contained"
                        fullWidth
                        sx={{ 
                          mt: 3,
                          bgcolor: '#ff9900', 
                          '&:hover': { bgcolor: '#e68a00' } 
                        }}
                      >
                        Enregistrer les notifications
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
      
      {/* Dialogue pour ajouter/modifier un examen */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentExam ? "Modifier l'Examen" : "Nouvel Examen"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Titre de l'Examen"
                fullWidth
                defaultValue={currentExam?.title || ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select
                  label="Module"
                  defaultValue={currentExam?.moduleId || ''}
                >
                  {mockModules.map((module) => (
                    <MenuItem key={module.id} value={module.id}>
                      {module.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Durée (minutes)"
                type="number"
                fullWidth
                defaultValue={60}
                InputProps={{ inputProps: { min: 10, max: 180 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Note minimale (%)"
                type="number"
                fullWidth
                defaultValue={70}
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre de questions"
                type="number"
                fullWidth
                defaultValue={20}
                InputProps={{ inputProps: { min: 5, max: 100 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Activer la surveillance par caméra"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button 
            variant="contained"
            onClick={handleClose}
            sx={{ 
              bgcolor: '#ff9900', 
              '&:hover': { bgcolor: '#e68a00' } 
            }}
          >
            {currentExam ? "Mettre à jour" : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminExams;