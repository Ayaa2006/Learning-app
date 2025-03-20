// components/admin/users/UserDetails.jsx
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Divider,
  Button,
  Avatar,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon
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

const UserDetails = ({ user, onStatusChange }) => {
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState(user?.status || 'active');

  // Ouvrir la boîte de dialogue de changement de statut
  const handleOpenStatusDialog = () => {
    setNewStatus(user.status);
    setOpenStatusDialog(true);
  };

  // Fermer la boîte de dialogue
  const handleCloseStatusDialog = () => {
    setOpenStatusDialog(false);
  };

  // Soumettre le changement de statut
  const handleSubmitStatusChange = () => {
    onStatusChange(newStatus);
    setOpenStatusDialog(false);
  };

  // Obtenir la couleur du chip de statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  // Obtenir le texte du statut
  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'inactive':
        return 'Inactif';
      case 'suspended':
        return 'Suspendu';
      default:
        return 'Inconnu';
    }
  };

  // Obtenir la couleur du chip de rôle
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'instructor':
        return 'info';
      case 'student':
        return 'success';
      default:
        return 'default';
    }
  };

  // Obtenir le texte du rôle
  const getRoleText = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'instructor':
        return 'Formateur';
      case 'student':
        return 'Étudiant';
      default:
        return 'Inconnu';
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body1">
            Informations utilisateur non disponibles
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            {/* Photo de profil */}
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  mx: 'auto',
                  mb: 2,
                  fontSize: '3rem'
                }}
                src={user.profileImage || ''}
                alt={user.fullName}
              >
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user.firstName} {user.lastName}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Chip
                  label={getRoleText(user.role)}
                  color={getRoleColor(user.role)}
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={getStatusText(user.status)}
                  color={getStatusColor(user.status)}
                />
              </Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleOpenStatusDialog}
                sx={{ mt: 1 }}
                fullWidth
              >
                Modifier le statut
              </Button>
            </Grid>

            {/* Informations personnelles */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Informations personnelles
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Nom complet
                      </Typography>
                      <Typography variant="body1">
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">{user.email}</Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Date d'inscription
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(user.createdAt)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        Dernière connexion
                      </Typography>
                      <Typography variant="body1">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Jamais connecté'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Informations supplémentaires
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Statut du compte
                    </Typography>
                    <Typography variant="body1">
                      {getStatusText(user.status)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">
                      Rôle
                    </Typography>
                    <Typography variant="body1">
                      {getRoleText(user.role)}
                    </Typography>
                  </Box>
                </Grid>

                {user.isMainAdmin && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label="Administrateur principal"
                        color="error"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Boîte de dialogue pour modifier le statut */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog}>
        <DialogTitle>Modifier le statut de l'utilisateur</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Veuillez sélectionner le nouveau statut pour {user.firstName} {user.lastName}.
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Statut</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              value={newStatus}
              label="Statut"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="active">Actif</MenuItem>
              <MenuItem value="inactive">Inactif</MenuItem>
              <MenuItem value="suspended">Suspendu</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmitStatusChange} 
            variant="contained" 
            color="primary"
            disabled={user.isMainAdmin && newStatus !== 'active'}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetails;