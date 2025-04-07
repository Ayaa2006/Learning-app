// src/pages/admin/UsersManagement.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Snackbar,
  Avatar,
  Tooltip,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  MailOutline as EmailIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const UsersManagement = () => {
  const { isAdmin, hasPermission, ROLES } = useAuth();
  
  // État pour les onglets (étudiants/professeurs)
  const [tabValue, setTabValue] = useState(0);
  
  // États pour les utilisateurs
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  
  // États pour les formulaires
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    speciality: '',
    birthDate: null,
    status: 'actif',
    password: ''
  });
  
  // États pour les dialogues
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // État pour les notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Récupération des utilisateurs depuis la base de données
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Fonction pour récupérer les utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/users');
      console.log("Données brutes reçues:", response.data);
      
      // Assurons-nous que les données sont un tableau
      const users = Array.isArray(response.data) ? response.data : [];
      
      // Séparation des utilisateurs par rôle
      const fetchedStudents = users
        .filter(user => user.role === 'STUDENT')
        .map(user => ({
          id: user._id,
          name: user.name || 'Sans nom',
          email: user.email || 'Sans email',
          status: user.status || 'actif',
          birthDate: user.birthDate ? new Date(user.birthDate) : null,
          registrationDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Inconnue',
          lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais',
          progress: user.progress || 0,
          coursesCompleted: user.coursesCompleted || 0,
          certifications: user.certifications || 0
        }));
      
      const fetchedTeachers = users
        .filter(user => user.role === 'TEACHER')
        .map(user => ({
          id: user._id,
          name: user.name || 'Sans nom',
          email: user.email || 'Sans email',
          status: user.status || 'actif',
          speciality: user.speciality || 'Non spécifié',
          registrationDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Inconnue',
          coursesCreated: user.coursesCreated || 0,
          rating: user.rating || 0
        }));
      
      console.log("Étudiants traités:", fetchedStudents.length);
      console.log("Professeurs traités:", fetchedTeachers.length);
      
      setStudents(fetchedStudents);
      setTeachers(fetchedTeachers);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setNotification({
        open: true,
        message: 'Erreur lors de la récupération des utilisateurs: ' + error.message,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  // Fonction pour changer d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSearchTerm('');
    setStatusFilter('tous');
  };
  
  // Fonction pour la suppression d'un utilisateur
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/admin/users/${userToDelete.id}`);
      
      if (tabValue === 0) {
        setStudents(students.filter(student => student.id !== userToDelete.id));
      } else {
        setTeachers(teachers.filter(teacher => teacher.id !== userToDelete.id));
      }
      
      setNotification({
        open: true,
        message: `${userToDelete.name} a été supprimé avec succès`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      setNotification({
        open: true,
        message: 'Erreur lors de la suppression de l\'utilisateur',
        severity: 'error'
      });
    }
    
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  // Fonction pour le changement de statut (activation/désactivation)
  const handleStatusChange = async (user) => {
    const newStatus = user.status === 'actif' ? 'inactif' : 'actif';
    
    try {
      await axios.patch(`/admin/users/${user.id}/status`, { status: newStatus });
      
      if (tabValue === 0) {
        setStudents(students.map(student => 
          student.id === user.id ? {...student, status: newStatus} : student
        ));
      } else {
        setTeachers(teachers.map(teacher => 
          teacher.id === user.id ? {...teacher, status: newStatus} : teacher
        ));
      }
      
      setNotification({
        open: true,
        message: `Le compte de ${user.name} a été ${newStatus === 'actif' ? 'activé' : 'désactivé'}`,
        severity: 'info'
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      setNotification({
        open: true,
        message: 'Erreur lors du changement de statut',
        severity: 'error'
      });
    }
  };
  
  // Gestion du formulaire d'ajout d'utilisateur
  const handleAddUserInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };
  
  const handleBirthDateChange = (date) => {
    setNewUser({
      ...newUser,
      birthDate: date ? date.toDate() : null
    });
  };
  
  // Fonction pour générer un mot de passe aléatoire
  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };
  
  // Fonction pour l'ajout d'un nouvel utilisateur
  const handleAddUser = () => {
    setNewUser({
      name: '',
      email: '',
      role: tabValue === 0 ? 'STUDENT' : 'TEACHER',
      speciality: '',
      birthDate: null,
      status: 'actif',
      password: tabValue === 1 ? generatePassword() : ''
    });
    setAddDialogOpen(true);
  };
  
  const handleAddUserSubmit = async () => {
    // Vérifications de base
    if (!newUser.name || !newUser.email) {
      setNotification({
        open: true,
        message: 'Veuillez remplir tous les champs obligatoires',
        severity: 'error'
      });
      return;
    }
    
    // Vérifications spécifiques selon le rôle
    if (newUser.role === 'STUDENT' && !newUser.birthDate) {
      setNotification({
        open: true,
        message: 'La date de naissance est obligatoire pour les étudiants',
        severity: 'error'
      });
      return;
    }
    
    if (newUser.role === 'TEACHER' && !newUser.speciality) {
      setNotification({
        open: true,
        message: 'La spécialité est obligatoire pour les professeurs',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Préparer les données selon le rôle
      const userData = {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status
      };
      
      // Ajouter des champs spécifiques selon le rôle
      if (newUser.role === 'STUDENT' && newUser.birthDate) {
        userData.birthDate = newUser.birthDate.toISOString();
      }
      
      if (newUser.role === 'TEACHER') {
        userData.speciality = newUser.speciality;
        userData.password = newUser.password;
      }
      
      // Envoi à l'API
      const response = await axios.post('/admin/users', userData);
      
      // Mettre à jour l'interface
      const newUserData = {
        id: response.data._id,
        name: response.data.name,
        email: response.data.email,
        status: response.data.status || 'actif',
        registrationDate: new Date().toLocaleDateString('fr-FR')
      };
      
      if (newUser.role === 'STUDENT') {
        newUserData.birthDate = newUser.birthDate;
        newUserData.lastLogin = 'Jamais';
        newUserData.progress = 0;
        newUserData.coursesCompleted = 0;
        newUserData.certifications = 0;
        setStudents([...students, newUserData]);
      } else {
        newUserData.speciality = newUser.speciality;
        newUserData.coursesCreated = 0;
        newUserData.rating = 0;
        setTeachers([...teachers, newUserData]);
      }
      
      setNotification({
        open: true,
        message: `L'utilisateur ${newUser.name} a été ajouté avec succès`,
        severity: 'success'
      });
      
      setAddDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
      setNotification({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de l\'ajout de l\'utilisateur',
        severity: 'error'
      });
    }
  };
  
  // Fonction pour l'édition d'un utilisateur
  const handleEditUser = (user) => {
    setCurrentUser({
      ...user,
      role: tabValue === 0 ? 'STUDENT' : 'TEACHER'
    });
    setEditDialogOpen(true);
  };
  
  const handleEditUserInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value
    });
  };
  
  const handleEditBirthDateChange = (date) => {
    setCurrentUser({
      ...currentUser,
      birthDate: date ? date.toDate() : null
    });
  };
  
  const handleEditUserSubmit = async () => {
    try {
      // Préparer les données à mettre à jour
      const userData = {
        name: currentUser.name,
        email: currentUser.email,
        status: currentUser.status
      };
      
      // Ajouter des champs spécifiques selon le rôle
      if (currentUser.role === 'STUDENT' && currentUser.birthDate) {
        userData.birthDate = currentUser.birthDate instanceof Date ? 
          currentUser.birthDate.toISOString() : 
          new Date(currentUser.birthDate).toISOString();
      }
      
      if (currentUser.role === 'TEACHER' && currentUser.speciality) {
        userData.speciality = currentUser.speciality;
      }
      
      // Envoi à l'API
      await axios.put(`/admin/users/${currentUser.id}`, userData);
      
      // Mettre à jour l'interface
      if (tabValue === 0) {
        setStudents(students.map(student => 
          student.id === currentUser.id ? {...student, ...userData, birthDate: currentUser.birthDate} : student
        ));
      } else {
        setTeachers(teachers.map(teacher => 
          teacher.id === currentUser.id ? {...teacher, ...userData} : teacher
        ));
      }
      
      setNotification({
        open: true,
        message: `L'utilisateur ${currentUser.name} a été modifié avec succès`,
        severity: 'success'
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la modification de l\'utilisateur:', error);
      setNotification({
        open: true,
        message: 'Erreur lors de la modification de l\'utilisateur',
        severity: 'error'
      });
    }
  };
  
 // Fonction pour réinitialiser le mot de passe d'un professeur
 const handleResetPassword = async (user) => {
  try {
    // Appel direct à la route d'urgence
    const response = await axios.get(`/admin/emergency-reset/${user.id}`);
    
    // URL mailto et mot de passe reçus du serveur
    const { mailtoUrl, password, email } = response.data;
    
    // Ouvre l'URL mailto directement
    window.location.href = mailtoUrl;
    
    setNotification({
      open: true,
      message: `Mot de passe réinitialisé: ${password} pour ${email}`,
      severity: 'success'
    });
  } catch (error) {
    console.error(error);
    setNotification({
      open: true,
      message: 'Erreur: ' + error.message,
      severity: 'error'
    });
  }
};
  // Fermeture des notifications
  const handleCloseNotification = () => {
    setNotification({...notification, open: false});
  };
  
  // Fonctions pour le rendu des statuts avec couleurs
  const getStatusChip = (status) => {
    if (status === 'actif') {
      return <Chip size="small" label="Actif" color="success" />;
    } else {
      return <Chip size="small" label="Inactif" color="error" />;
    }
  };
  
  // Filtrer les listes selon les critères de recherche et de statut
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'tous' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (teacher.speciality && teacher.speciality.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'tous' || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Rendu des cartes d'information
  const renderInfoCards = () => {
    if (tabValue === 0) {
      return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Étudiants
                </Typography>
                <Typography variant="h4">{students.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Étudiants Actifs
                </Typography>
                <Typography variant="h4">
                  {students.filter(s => s.status === 'actif').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Certifications Délivrées
                </Typography>
                <Typography variant="h4">
                  {students.reduce((sum, s) => sum + (s.certifications || 0), 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Professeurs
                </Typography>
                <Typography variant="h4">{teachers.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Professeurs Actifs
                </Typography>
                <Typography variant="h4">
                  {teachers.filter(t => t.status === 'actif').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Cours Créés
                </Typography>
                <Typography variant="h4">
                  {teachers.reduce((sum, t) => sum + (t.coursesCreated || 0), 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      );
    }
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestion des Utilisateurs
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          {tabValue === 0 ? "Ajouter un étudiant" : "Ajouter un professeur"}
        </Button>
      </Box>
      
      {/* Cartes d'information */}
      {renderInfoCards()}
      
      {/* Tabs pour choisir entre étudiants et professeurs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab 
            icon={<SchoolIcon />} 
            label="Étudiants" 
            iconPosition="start"
          />
          <Tab 
            icon={<PersonIcon />} 
            label="Professeurs" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>
      
      {/* Filtres et recherche */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Rechercher..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: '250px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: '150px' }}>
            <InputLabel id="status-filter-label">Statut</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Statut"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="tous">Tous</MenuItem>
              <MenuItem value="actif">Actifs</MenuItem>
              <MenuItem value="inactif">Inactifs</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined" 
            startIcon={<RefreshIcon />}
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('tous');
              fetchUsers(); // Recharger les données
            }}
          >
            Actualiser
          </Button>
        </Box>
      </Box>
      
      {/* Affichage du chargement */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Tableau des étudiants */}
      {!loading && tabValue === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Date de naissance</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Inscription</TableCell>
                <TableCell>Progression</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ mr: 2, bgcolor: student.status === 'actif' ? 'primary.main' : 'grey.400' }}
                        >
                          {student.name.charAt(0)}
                        </Avatar>
                        {student.name}
                      </Box>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      {student.birthDate ? new Date(student.birthDate).toLocaleDateString('fr-FR') : 'Non spécifiée'}
                    </TableCell>
                    <TableCell>{getStatusChip(student.status)}</TableCell>
                    <TableCell>{student.registrationDate}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: '100%', 
                            mr: 1, 
                            bgcolor: 'grey.300',
                            borderRadius: 5,
                            height: 10
                          }}
                        >
                          <Box
                            sx={{
                              width: `${student.progress}%`,
                              bgcolor: student.progress > 75 ? 'success.main' : 
                                     student.progress > 40 ? 'warning.main' : 'error.main',
                              height: 10,
                              borderRadius: 5
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {student.progress}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Modifier">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditUser(student)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={student.status === 'actif' ? 'Désactiver' : 'Activer'}>
                        <IconButton 
                          size="small" 
                          color={student.status === 'actif' ? 'error' : 'success'}
                          onClick={() => handleStatusChange(student)}
                        >
                          {student.status === 'actif' ? 
                            <BlockIcon fontSize="small" /> : 
                            <ActivateIcon fontSize="small" />
                          }
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(student)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      Aucun étudiant trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Tableau des professeurs */}
      {!loading && tabValue === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Spécialité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Inscription</TableCell>
                <TableCell>Cours créés</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ mr: 2, bgcolor: teacher.status === 'actif' ? 'success.main' : 'grey.400' }}
                        >
                          {teacher.name.charAt(0)}
                        </Avatar>
                        {teacher.name}
                      </Box>
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.speciality}</TableCell>
                    <TableCell>{getStatusChip(teacher.status)}</TableCell>
                    <TableCell>{teacher.registrationDate}</TableCell>
                    <TableCell>{teacher.coursesCreated}</TableCell>
                    <TableCell>
                      <Tooltip title="Modifier">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditUser(teacher)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Réinitialiser mot de passe">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleResetPassword(teacher)}
                        >
                          <EmailIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={teacher.status === 'actif' ? 'Désactiver' : 'Activer'}>
                        <IconButton 
                          size="small" 
                          color={teacher.status === 'actif' ? 'error' : 'success'}
                          onClick={() => handleStatusChange(teacher)}
                        >
                          {teacher.status === 'actif' ? 
                            <BlockIcon fontSize="small" /> : 
                            <ActivateIcon fontSize="small" />
                          }
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(teacher)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      Aucun professeur trouvé
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
     {/* Dialogue de confirmation de suppression */}
     <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete?.name}</strong> ? Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue d'ajout d'utilisateur */}
      <Dialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {tabValue === 0 ? "Ajouter un étudiant" : "Ajouter un professeur"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom complet"
                variant="outlined"
                name="name"
                value={newUser.name}
                onChange={handleAddUserInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleAddUserInputChange}
                required
              />
            </Grid>
            {tabValue === 0 && (
              <Grid item xs={12}>
                <DatePicker
                  label="Date de naissance"
                  value={newUser.birthDate ? dayjs(newUser.birthDate) : null}
                  onChange={handleBirthDateChange}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            )}
            {tabValue === 1 && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Spécialité"
                  variant="outlined"
                  name="speciality"
                  value={newUser.speciality}
                  onChange={handleAddUserInputChange}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  label="Statut"
                  name="status"
                  value={newUser.status}
                  onChange={handleAddUserInputChange}
                >
                  <MenuItem value="actif">Actif</MenuItem>
                  <MenuItem value="inactif">Inactif</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {tabValue === 1 && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Mot de passe"
                  variant="outlined"
                  name="password"
                  value={newUser.password}
                  onChange={handleAddUserInputChange}
                  helperText="Un mot de passe aléatoire a été généré. Vous pouvez le modifier si nécessaire."
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleAddUserSubmit}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue d'édition d'utilisateur */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Modifier {tabValue === 0 ? "l'étudiant" : "le professeur"}
        </DialogTitle>
        <DialogContent>
          {currentUser && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom complet"
                  variant="outlined"
                  name="name"
                  value={currentUser.name}
                  onChange={handleEditUserInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  name="email"
                  value={currentUser.email}
                  onChange={handleEditUserInputChange}
                  required
                />
              </Grid>
              {tabValue === 0 && (
                <Grid item xs={12}>
                  <DatePicker
                    label="Date de naissance"
                    value={currentUser.birthDate ? dayjs(currentUser.birthDate) : null}
                    onChange={handleEditBirthDateChange}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              )}
              {tabValue === 1 && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Spécialité"
                    variant="outlined"
                    name="speciality"
                    value={currentUser.speciality || ''}
                    onChange={handleEditUserInputChange}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    label="Statut"
                    name="status"
                    value={currentUser.status}
                    onChange={handleEditUserInputChange}
                  >
                    <MenuItem value="actif">Actif</MenuItem>
                    <MenuItem value="inactif">Inactif</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {tabValue === 1 && (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleResetPassword(currentUser)}
                    fullWidth
                  >
                    Réinitialiser le mot de passe
                  </Button>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleEditUserSubmit}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
      
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
    </Box>
  );
};

export default UsersManagement;