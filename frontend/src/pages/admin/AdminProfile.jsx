import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Avatar,
    TextField,
    Button,
    Tabs,
    Tab,
    Alert,
    Snackbar,
    Switch,
    Chip,
    Card,
    CardContent
  } from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Notifications as NotificationIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';
import AdminLayout from '../../components/layouts/AdminLayout';
import { useAuth } from '../../contexts/AuthContext';

const AdminProfile = ({ toggleDarkMode, darkMode }) => {
  const { user } = useAuth();
  
  // État pour les onglets
  const [tabValue, setTabValue] = useState(0);
  
  // États pour les formulaires
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Administrateur',
    email: user?.email || 'admin@skillpath.com',
    phone: user?.phone || '+33 6 12 34 56 78',
    position: user?.position || 'Administrateur système',
    bio: user?.bio || 'Administrateur principal de la plateforme de formation SkillPath.',
  });
  
  // État pour le mode édition
  const [editMode, setEditMode] = useState(false);
  
  // État pour les notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // États pour les préférences de notification
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifs: true,
    newUsers: true,
    completions: true,
    cheatAttempts: true,
    systemUpdates: true
  });
  
  // Historique des activités (simulé)
  const activityHistory = [
    {
      action: "Connexion à la plateforme",
      date: "03/04/2025",
      time: "09:15",
      ip: "192.168.1.45"
    },
    {
      action: "Modification de module",
      target: "JavaScript Avancé",
      date: "02/04/2025",
      time: "14:32",
      ip: "192.168.1.45"
    },
    {
      action: "Validation de certificat",
      target: "Marie Durand",
      date: "01/04/2025",
      time: "11:20",
      ip: "195.24.65.12"
    },
    {
      action: "Ajout d'un professeur",
      target: "Dr. Martin Legrand",
      date: "28/03/2025",
      time: "16:45",
      ip: "192.168.1.45"
    },
  ];
  
  // Gestionnaires d'événements
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
    
    // Si on sort du mode édition, on simule la sauvegarde
    if (editMode) {
      setNotification({
        open: true,
        message: 'Profil mis à jour avec succès',
        severity: 'success'
      });
    }
  };
  
  const handleNotificationPrefChange = (pref) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [pref]: !prev[pref]
    }));
    
    setNotification({
      open: true,
      message: 'Préférences de notification mises à jour',
      severity: 'success'
    });
  };
  
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };
  
  return (
    <AdminLayout toggleDarkMode={toggleDarkMode} darkMode={darkMode}>
      <Box sx={{ py: 4, bgcolor: darkMode ? 'background.default' : '#f5f7fb', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Mon Profil
            </Typography>
            <Chip 
              label="Administrateur" 
              color="error"
              icon={<AdminIcon />}
            />
          </Box>
          
          <Grid container spacing={4}>
            {/* Colonne de gauche - Photo de profil et infos */}
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={user?.profilePic || ""}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 2,
                      bgcolor: '#f44336',
                      fontSize: '3rem'
                    }}
                  >
                    {profileData.name.charAt(0)}
                  </Avatar>
                  
                  <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                    {profileData.name}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                    {profileData.position}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleToggleEditMode}
                    sx={{ mb: 2 }}
                  >
                    {editMode ? "Enregistrer les modifications" : "Modifier le profil"}
                  </Button>
                </Box>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Informations du compte
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profileData.email}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Téléphone
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {profileData.phone}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rôle
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Administrateur système
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Date d'inscription
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    15/11/2023
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Dernière connexion
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    Aujourd'hui à 09:15
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            {/* Colonne de droite - Onglets et formulaires */}
            <Grid item xs={12} md={8}>
              <Paper elevation={0} sx={{ borderRadius: 2 }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  variant="fullWidth"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab icon={<PersonIcon />} label="Profil" />
                  <Tab icon={<NotificationIcon />} label="Notifications" />
                  <Tab icon={<HistoryIcon />} label="Activité" />
                </Tabs>
                
                <Box sx={{ p: 3 }}>
                  {/* Onglet Profil */}
                  {tabValue === 0 && (
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Informations personnelles
                      </Typography>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Nom complet"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            fullWidth
                            disabled={!editMode}
                            variant="outlined"
                            margin="normal"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            fullWidth
                            disabled={!editMode}
                            variant="outlined"
                            margin="normal"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Téléphone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            fullWidth
                            disabled={!editMode}
                            variant="outlined"
                            margin="normal"
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Poste"
                            name="position"
                            value={profileData.position}
                            onChange={handleProfileChange}
                            fullWidth
                            disabled={!editMode}
                            variant="outlined"
                            margin="normal"
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            label="Biographie"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            fullWidth
                            disabled={!editMode}
                            variant="outlined"
                            margin="normal"
                            multiline
                            rows={4}
                          />
                        </Grid>
                      </Grid>
                      
                      {editMode && (
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<SaveIcon />}
                            onClick={handleToggleEditMode}
                          >
                            Enregistrer les modifications
                          </Button>
                        </Box>
                      )}
                    </Box>
                  )}
                  
                  {/* Onglet Notifications */}
                  {tabValue === 1 && (
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Préférences de notification
                      </Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                  Notifications par email
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Recevoir les notifications par email
                                </Typography>
                              </Box>
                              <Switch
                                checked={notificationPrefs.emailNotifs}
                                onChange={() => handleNotificationPrefChange('emailNotifs')}
                                color="primary"
                              />
                            </Box>
                          </Paper>
                        </Grid>

                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle1">
                                  Nouveaux utilisateurs
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Notification lors de l'inscription d'un nouvel utilisateur
                                </Typography>
                              </Box>
                              <Switch
                                checked={notificationPrefs.newUsers}
                                onChange={() => handleNotificationPrefChange('newUsers')}
                                color="primary"
                              />
                            </Box>
                          </Paper>
                        </Grid>

                        <Grid item xs={12}>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle1">
                                  Modules complétés
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Notification lorsque des modules sont complétés
                                </Typography>
                              </Box>
                              <Switch
                                checked={notificationPrefs.completions}
                                onChange={() => handleNotificationPrefChange('completions')}
                                color="primary"
                              />
                            </Box>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                  
                  {/* Onglet Activité */}
                  {tabValue === 3 && (
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Historique d'activité
                      </Typography>
                      
                      {activityHistory.map((activity, index) => (
                        <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                          <CardContent>
                            <Grid container>
                              <Grid item xs={7}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                                  {activity.action}
                                </Typography>
                                {activity.target && (
                                  <Typography variant="body2" color="text.secondary">
                                    {activity.target}
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xs={5} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2">
                                  {activity.date} à {activity.time}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  IP: {activity.ip}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                      
                      <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button variant="outlined">
                          Voir plus d'activités
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default AdminProfile;