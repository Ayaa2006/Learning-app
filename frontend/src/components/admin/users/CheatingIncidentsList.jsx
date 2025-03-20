// components/admin/users/CheatingIncidentsList.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Warning as WarningIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Fonction pour formater les dates
const formatDate = (dateString) => {
  if (!dateString) return 'Non disponible';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const CheatingIncidentsList = ({ incidents, onDeleteIncident }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedIncident(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedIncident && onDeleteIncident) {
      setLoading(true);
      await onDeleteIncident(selectedIncident._id);
      setLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedIncident(null);
    }
  };

  const handleOpenDeleteDialog = (incident) => {
    setSelectedIncident(incident);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedIncident(null);
  };

  // Obtenir le type d'incident en français
  const getIncidentTypeText = (type) => {
    switch (type) {
      case 'multiple_faces':
        return 'Plusieurs visages détectés';
      case 'no_face':
        return 'Aucun visage détecté';
      case 'window_switched':
        return 'Changement de fenêtre';
      case 'browser_tab_changed':
        return 'Changement d\'onglet';
      case 'manual_report':
        return 'Signalement manuel';
      default:
        return type || 'Inconnu';
    }
  };

  // Obtenir la couleur en fonction du type d'incident
  const getIncidentTypeColor = (type) => {
    switch (type) {
      case 'multiple_faces':
      case 'no_face':
        return 'error';
      case 'window_switched':
      case 'browser_tab_changed':
        return 'warning';
      case 'manual_report':
        return 'info';
      default:
        return 'default';
    }
  };

  if (!incidents || incidents.length === 0) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Box sx={{ mb: 2 }}>
              <WarningIcon color="disabled" sx={{ fontSize: 48 }} />
            </Box>
            <Typography variant="h6" gutterBottom>
              Aucun incident de triche
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Cet utilisateur n'a aucun incident de triche enregistré.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Liste des incidents de triche
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <TableContainer component={Paper} variant="outlined">
            <Table aria-label="tableau des incidents de triche">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'action.hover' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Module</TableCell>
                  <TableCell>Type d'incident</TableCell>
                  <TableCell>Action prise</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident._id}>
                    <TableCell>{formatDate(incident.date)}</TableCell>
                    <TableCell>
                      {incident.moduleId?.title || incident.moduleName || 'Module inconnu'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getIncidentTypeText(incident.type)}
                        color={getIncidentTypeColor(incident.type)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {incident.actionTaken || 'Examen échoué'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewIncident(incident)}
                          aria-label="voir les détails"
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                        
                        {onDeleteIncident && (
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleOpenDeleteDialog(incident)}
                            aria-label="supprimer l'incident"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Modal de détails de l'incident */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Détails de l'incident de triche
        </DialogTitle>
        <DialogContent dividers>
          {selectedIncident && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Date et heure
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(selectedIncident.date)}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Type d'incident
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <Chip
                    label={getIncidentTypeText(selectedIncident.type)}
                    color={getIncidentTypeColor(selectedIncident.type)}
                    size="small"
                  />
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Module
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedIncident.moduleId?.title || selectedIncident.moduleName || 'Module inconnu'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Examen
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {selectedIncident.examId?.title || selectedIncident.examName || 'Examen inconnu'}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Description
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                  <Typography variant="body1">
                    {selectedIncident.description || 'Aucune description disponible'}
                  </Typography>
                </Paper>
              </Grid>
              
              {selectedIncident.evidenceUrl && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Preuve (capture d'écran)
                  </Typography>
                  <Box sx={{ mt: 1, textAlign: 'center' }}>
                    <img 
                      src={selectedIncident.evidenceUrl} 
                      alt="Preuve de triche" 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px', 
                        border: '1px solid #ddd' 
                      }} 
                    />
                  </Box>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">
                  Action prise
                </Typography>
                <Typography variant="body1" color="error" gutterBottom>
                  {selectedIncident.actionTaken || 'Examen échoué - Note de 0'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer cet incident de triche ? Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={loading}>
            Annuler
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CheatingIncidentsList;