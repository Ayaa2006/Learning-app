// src/pages/CertificatesAdmin.jsx
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
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  FileDownload as FileDownloadIcon, 
  Search as SearchIcon,
  Email as EmailIcon,
  ContentCopy as ContentCopyIcon,
  VerifiedUser as VerifiedUserIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { mockCertificates, mockUsers, mockModules } from '../data/mockData';

const CertificatesAdmin = () => {
  const [certificates, setCertificates] = useState(mockCertificates);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleGenerateCertificate = () => {
    // Logique pour générer un nouveau certificat
    const newCertificate = {
      id: Math.max(...certificates.map(c => c.id)) + 1,
      studentId: parseInt(selectedUser),
      studentName: mockUsers.find(u => u.id === parseInt(selectedUser))?.name || "Unknown",
      moduleTitle: mockModules.find(m => m.id === parseInt(selectedModule))?.title || "Unknown",
      // Continuation de CertificatesAdmin.jsx
      issueDate: new Date().toISOString().split('T')[0],
      verificationCode: `CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    };
    
    setCertificates([...certificates, newCertificate]);
    handleCloseDialog();
  };
  
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const filteredCertificates = certificates.filter(certificate => 
    certificate.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.moduleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.verificationCode.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <Box sx={{ py: 4, bgcolor: '#f5f7fb', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Gestion des Certificats
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <TextField
                  placeholder="Rechercher par étudiant, module ou code..."
                  value={searchQuery}
                  onChange={handleSearch}
                  variant="outlined"
                  sx={{ width: 350 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  variant="contained" 
                  startIcon={<VerifiedUserIcon />}
                  onClick={handleOpenDialog}
                  sx={{ 
                    bgcolor: '#ff9900', 
                    '&:hover': { bgcolor: '#e68a00' } 
                  }}
                >
                  Générer un Certificat
                </Button>
              </Box>
              
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Étudiant</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Module</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date d'émission</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Code de Vérification</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCertificates.map((certificate) => (
                      <TableRow key={certificate.id}>
                        <TableCell>{certificate.id}</TableCell>
                        <TableCell>{certificate.studentName}</TableCell>
                        <TableCell>{certificate.moduleTitle}</TableCell>
                        <TableCell>{certificate.issueDate}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {certificate.verificationCode}
                            </Typography>
                            <IconButton size="small" color="primary" onClick={() => navigator.clipboard.writeText(certificate.verificationCode)}>
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton color="primary" title="Télécharger le certificat">
                            <FileDownloadIcon />
                          </IconButton>
                          <IconButton color="info" title="Envoyer par email">
                            <EmailIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Statistiques
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total des certificats émis
                </Typography>
                <Typography variant="h4" sx={{ color: '#ff9900', fontWeight: 'bold' }}>
                  {certificates.length}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Certificats émis ce mois
                </Typography>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                  {certificates.filter(c => {
                    const today = new Date();
                    const certDate = new Date(c.issueDate);
                    return certDate.getMonth() === today.getMonth() && 
                           certDate.getFullYear() === today.getFullYear();
                  }).length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Taux de certification
                </Typography>
                <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                  {Math.round((certificates.length / mockUsers.filter(u => u.role === 'student').length) * 100)}%
                </Typography>
              </Box>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Modules les plus certifiés
              </Typography>
              {mockModules.slice(0, 3).map((module, index) => (
                <Box key={module.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="body2">
                      {module.title}
                    </Typography>
                    <Chip 
                      size="small" 
                      label={`${Math.round((30 - index * 7))} certificats`} 
                      sx={{ bgcolor: index === 0 ? '#ffecc7' : '#f5f5f5' }}
                    />
                  </Box>
                  <Box 
                    sx={{ 
                      height: 6, 
                      bgcolor: '#e0e0e0', 
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${85 - index * 15}%`,
                        bgcolor: '#ff9900',
                        borderRadius: 3
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Dialogue pour générer un certificat */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Générer un Nouveau Certificat</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Étudiant</InputLabel>
                <Select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  label="Étudiant"
                >
                  {mockUsers.filter(u => u.role === 'student').map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Module</InputLabel>
                <Select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  label="Module"
                >
                  {mockModules.map((module) => (
                    <MenuItem key={module.id} value={module.id}>
                      {module.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            variant="contained" 
            onClick={handleGenerateCertificate}
            startIcon={<CheckIcon />}
            disabled={!selectedUser || !selectedModule}
            sx={{ 
              bgcolor: '#ff9900', 
              '&:hover': { bgcolor: '#e68a00' } 
            }}
          >
            Générer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CertificatesAdmin;