// pages/admin/users/UsersPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { fetchAllUsers, deleteUser } from '../../../services/userService';

const UsersPage = () => {
  const navigate = useNavigate();
  
  // États pour les données
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // État pour le dialogue de suppression
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // État pour les alertes
  const [alert, setAlert] = useState(null);
  
  // Effet pour charger les utilisateurs
  useEffect(() => {
    loadUsers();
  }, [page, rowsPerPage, roleFilter, statusFilter]);
  
  // Fonction pour charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Préparer les filtres pour l'API
      const filters = {
        role: roleFilter,
        status: statusFilter,
        search: searchTerm
      };
      
      const data = await fetchAllUsers(page + 1, rowsPerPage, filters);
      
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour gérer la recherche
  const handleSearch = () => {
    setPage(0);
    loadUsers();
  };
  
  // Fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
    setPage(0);
    setIsFiltersOpen(false);
  };
  
  // Fonction pour gérer le changement de page
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Fonction pour gérer le changement de lignes par page
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Fonction pour ouvrir le dialogue de suppression
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };
  
  // Fonction pour fermer le dialogue de suppression
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };
  
  // Fonction pour confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteUser(userToDelete._id);
      
      // Mettre à jour la liste des utilisateurs
      setUsers(users.filter(user => user._id !== userToDelete._id));
      
      // Afficher l'alerte de succès
      setAlert({
        type: 'success',
        message: `L'utilisateur ${userToDelete.firstName} ${userToDelete.lastName} a été supprimé avec succès.`
      });
      
      // Fermer le dialogue
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      
      // Recharger les utilisateurs si nécessaire
      if (users.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        loadUsers();
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: `Erreur lors de la suppression de l'utilisateur: ${err.message || err}`
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Fonction pour fermer l'alerte
  const handleCloseAlert = () => {
    setAlert(null);
  };
  
  // Fonction pour afficher le badge de rôle
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Chip size="small" label="Admin" color="error" />;
      case 'instructor':
        return <Chip size="small" label="Formateur" color="info" />;
      case 'student':
        return <Chip size="small" label="Étudiant" color="success" />;
      default:
        return <Chip size="small" label="Inconnu" />;
    }
  };
  
  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Chip size="small" label="Actif" color="success" />;
      case 'inactive':
        return <Chip size="small" label="Inactif" color="warning" />;
      case 'suspended':
        return <Chip size="small" label="Suspendu" color="error" />;
      default:
        return <Chip size="small" label="Inconnu" />;
    }
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Gestion des utilisateurs
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              component={Link}
              to="/admin/users/create"
            >
              Ajouter un utilisateur
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Alerte */}
      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 3 }} 
          onClose={handleCloseAlert}
        >
          {alert.message}
        </Alert>
      )}
      
      {/* Carte de filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rechercher un utilisateur"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                startIcon={<FilterListIcon />}
                fullWidth
              >
                Filtres
              </Button>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={handleResetFilters}
                fullWidth
              >
                Réinitialiser
              </Button>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
                fullWidth
              >
                Rechercher
              </Button>
            </Grid>
            
            {isFiltersOpen && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="role-filter-label">Rôle</InputLabel>
                    <Select
                      labelId="role-filter-label"
                      id="role-filter"
                      value={roleFilter}
                      label="Rôle"
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <MenuItem value="all">Tous les rôles</MenuItem>
                      <MenuItem value="admin">Administrateur</MenuItem>
                      <MenuItem value="instructor">Formateur</MenuItem>
                      <MenuItem value="student">Étudiant</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="status-filter-label">Statut</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      id="status-filter"
                      value={statusFilter}
                      label="Statut"
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <MenuItem value="all">Tous les statuts</MenuItem>
                      <MenuItem value="active">Actif</MenuItem>
                      <MenuItem value="inactive">Inactif</MenuItem>
                      <MenuItem value="suspended">Suspendu</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tableau des utilisateurs */}
      <Card>
        <CardContent>
          {loading && users.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                      <TableCell>Nom</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Rôle</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Date d'inscription</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Aucun utilisateur trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell>
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/admin/users/${user._id}`)}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleOpenDeleteDialog(user)}
                                disabled={user.role === 'admin' && user.isMainAdmin}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <TablePagination
                component="div"
                count={totalUsers}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage="Lignes par page:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
              />
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
            <strong>
              {userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''}
            </strong>
            ? Cette action est irréversible.
            {userToDelete && userToDelete.role === 'student' && (
              <Box sx={{ mt: 2 }}>
                Toutes les données de progression et les incidents de triche associés à cet utilisateur seront également supprimés.
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersPage;