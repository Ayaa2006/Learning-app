// pages/admin/modules/ModulesPage.jsx
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
  Paper,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Assignment as AssignmentIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { fetchAllModules, deleteModule, reorderModules } from '../../../services/moduleService';

const ModulesPage = () => {
  const navigate = useNavigate();
  
  // États pour les données
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalModules, setTotalModules] = useState(0);
  
  // États pour la pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // États pour les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOption, setSortOption] = useState('order');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // État pour le dialogue de suppression
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  
  // État pour le mode réorganisation
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderedModules, setReorderedModules] = useState([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  
  // État pour les alertes
  const [alert, setAlert] = useState(null);
  
  // Effet pour charger les modules
  useEffect(() => {
    if (!isReorderMode) {
      loadModules();
    }
  }, [page, rowsPerPage, statusFilter, sortOption, isReorderMode]);
  
  // Fonction pour charger les modules
  const loadModules = async () => {
    try {
      setLoading(true);
      
      // Préparer les filtres pour l'API
      const filters = {
        status: statusFilter,
        search: searchTerm,
        sort: sortOption
      };
      
      const data = await fetchAllModules(page + 1, rowsPerPage, filters);
      
      setModules(data.modules);
      setTotalModules(data.totalModules);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des modules: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour gérer la recherche
  const handleSearch = () => {
    setPage(0);
    loadModules();
  };
  
  // Fonction pour réinitialiser les filtres
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortOption('order');
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
  const handleOpenDeleteDialog = (module) => {
    setModuleToDelete(module);
    setIsDeleteDialogOpen(true);
    setDeleteError(null);
  };
  
  // Fonction pour fermer le dialogue de suppression
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setModuleToDelete(null);
    setDeleteError(null);
  };
  
  // Fonction pour confirmer la suppression
  const handleConfirmDelete = async () => {
    if (!moduleToDelete) return;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      await deleteModule(moduleToDelete._id);
      
      // Mettre à jour la liste des modules
      setModules(modules.filter(module => module._id !== moduleToDelete._id));
      
      // Afficher l'alerte de succès
      setAlert({
        type: 'success',
        message: `Le module "${moduleToDelete.title}" a été supprimé avec succès.`
      });
      
      // Fermer le dialogue
      setIsDeleteDialogOpen(false);
      setModuleToDelete(null);
      
      // Recharger les modules si nécessaire
      if (modules.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        loadModules();
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Si le module ne peut pas être supprimé en raison de dépendances
        setDeleteError(err.response.data.message || 'Impossible de supprimer ce module car il est utilisé par d\'autres éléments.');
      } else {
        setDeleteError('Erreur lors de la suppression du module: ' + (err.message || err));
      }
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Fonction pour fermer l'alerte
  const handleCloseAlert = () => {
    setAlert(null);
  };
  
  // Fonction pour activer le mode réorganisation
  const handleEnableReorderMode = () => {
    // Charger tous les modules pour la réorganisation
    const loadAllModules = async () => {
      try {
        setLoading(true);
        
        const data = await fetchAllModules(1, 100, { sort: 'order' });
        
        setReorderedModules(data.modules);
        setIsReorderMode(true);
      } catch (err) {
        setAlert({
          type: 'error',
          message: 'Erreur lors du chargement des modules: ' + (err.message || err)
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAllModules();
  };
  
  // Fonction pour annuler le mode réorganisation
  const handleCancelReorderMode = () => {
    setIsReorderMode(false);
    setReorderedModules([]);
  };
  
  // Fonction pour gérer la fin du glisser-déposer
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(reorderedModules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Mettre à jour l'ordre de chaque module
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    
    setReorderedModules(updatedItems);
  };
  
  // Fonction pour sauvegarder l'ordre des modules
  const handleSaveOrder = async () => {
    try {
      setIsSavingOrder(true);
      
      const moduleOrders = reorderedModules.map((module, index) => ({
        id: module._id,
        order: index + 1
      }));
      
      await reorderModules(moduleOrders);
      
      setAlert({
        type: 'success',
        message: 'L\'ordre des modules a été mis à jour avec succès.'
      });
      
      setIsReorderMode(false);
      setReorderedModules([]);
      loadModules();
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Erreur lors de la mise à jour de l\'ordre des modules: ' + (err.message || err)
      });
    } finally {
      setIsSavingOrder(false);
    }
  };
  
  // Fonction pour afficher le badge de statut
  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Chip size="small" label="Publié" color="success" />;
      case 'draft':
        return <Chip size="small" label="Brouillon" color="warning" />;
      case 'archived':
        return <Chip size="small" label="Archivé" color="error" />;
      default:
        return <Chip size="small" label="Inconnu" />;
    }
  };
  
  // Rendu du tableau en mode normal
  const renderNormalTable = () => (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'action.hover' }}>
            <TableCell>Ordre</TableCell>
            <TableCell>Titre</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Durée (min)</TableCell>
            <TableCell>Date de création</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {modules.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">
                Aucun module trouvé
              </TableCell>
            </TableRow>
          ) : (
            modules.map((module) => (
              <TableRow key={module._id}>
                <TableCell>{module.order}</TableCell>
                <TableCell>{module.title}</TableCell>
                <TableCell>{getStatusBadge(module.status)}</TableCell>
                <TableCell>{module.duration}</TableCell>
                <TableCell>
                  {new Date(module.createdAt).toLocaleDateString('fr-FR')}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Voir les détails">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/admin/modules/${module._id}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => navigate(`/admin/modules/${module._id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gérer les cours">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => navigate(`/admin/modules/${module._id}/courses`)}
                      >
                        <BookIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Gérer l'examen">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => navigate(`/admin/modules/${module._id}/exam`)}
                      >
                        <AssignmentIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <span>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenDeleteDialog(module)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
  // Rendu du tableau en mode réorganisation
  const renderReorderTable = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="modules">
        {(provided) => (
          <TableContainer 
            component={Paper} 
            variant="outlined"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell width="50px"></TableCell>
                  <TableCell>Ordre</TableCell>
                  <TableCell>Titre</TableCell>
                  <TableCell>Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reorderedModules.map((module, index) => (
                  <Draggable 
                    key={module._id} 
                    draggableId={module._id} 
                    index={index}
                  >
                    {(provided) => (
                      <TableRow
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'action.hover' 
                          }
                        }}
                      >
                        <TableCell {...provided.dragHandleProps}>
                          <DragIndicatorIcon />
                        </TableCell>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{module.title}</TableCell>
                        <TableCell>{getStatusBadge(module.status)}</TableCell>
                      </TableRow>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Gestion des modules
            </Typography>
          </Grid>
          <Grid item>
            {isReorderMode ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancelReorderMode}
                  disabled={isSavingOrder}
                >
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveOrder}
                  disabled={isSavingOrder}
                >
                  {isSavingOrder ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Enregistrer l\'ordre'
                  )}
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<DragIndicatorIcon />}
                  onClick={handleEnableReorderMode}
                >
                  Réorganiser
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  component={Link}
                  to="/admin/modules/create"
                >
                  Ajouter un module
                </Button>
              </Box>
            )}
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
      
      {!isReorderMode && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rechercher un module"
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
                      <InputLabel id="status-filter-label">Statut</InputLabel>
                      <Select
                        labelId="status-filter-label"
                        id="status-filter"
                        value={statusFilter}
                        label="Statut"
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <MenuItem value="all">Tous les statuts</MenuItem>
                        <MenuItem value="published">Publié</MenuItem>
                        <MenuItem value="draft">Brouillon</MenuItem>
                        <MenuItem value="archived">Archivé</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="sort-filter-label">Trier par</InputLabel>
                      <Select
                        labelId="sort-filter-label"
                        id="sort-filter"
                        value={sortOption}
                        label="Trier par"
                        onChange={(e) => setSortOption(e.target.value)}
                      >
                        <MenuItem value="order">Ordre d'affichage</MenuItem>
                        <MenuItem value="title">Titre</MenuItem>
                        <MenuItem value="createdAt">Date de création</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
        </Card>
      )}
      
      {/* Tableau des modules */}
      <Card>
        <CardContent>
          {loading && (modules.length === 0 || isReorderMode) ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              {isReorderMode ? renderReorderTable() : renderNormalTable()}
              
              {!isReorderMode && (
                <TablePagination
                  component="div"
                  count={totalModules}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  labelRowsPerPage="Lignes par page:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
                />
              )}
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
            Êtes-vous sûr de vouloir supprimer le module{' '}
            <strong>
              {moduleToDelete ? moduleToDelete.title : ''}
            </strong>
            ? Cette action est irréversible.
          </DialogContentText>
          
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
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

export default ModulesPage;