// src/pages/Certificate.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Divider,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  VerifiedUser as VerifiedUserIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  ContentCopy as ContentCopyIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  Email as EmailIcon,
  Check as CheckIcon
} from '@mui/icons-material';

// Données fictives pour les certificats
const mockCertificates = [
  {
    id: 1,
    title: "Introduction à la Programmation",
    issueDate: "2025-02-15",
    verificationCode: "CERT-A1B2C3",
    instructor: "Dr. Alex Smith",
    skills: ["Algorithmes de base", "Logique de programmation", "Structures de contrôle"],
    description: "Ce certificat valide les compétences en programmation fondamentale, incluant la compréhension des algorithmes de base, la logique de programmation et les structures de contrôle.",
    imageUrl: "https://via.placeholder.com/800x600?text=Certificate+Introduction+to+Programming"
  },
  {
    id: 2,
    title: "Variables et Types de Données",
    issueDate: "2025-03-08",
    verificationCode: "CERT-D4E5F6",
    instructor: "Prof. Sarah Johnson",
    skills: ["Types de données", "Manipulation de variables", "Opérateurs"],
    description: "Ce certificat atteste de la maîtrise des variables et types de données, comprenant la déclaration et la manipulation de variables, les types primitifs et les opérateurs.",
    imageUrl: "https://via.placeholder.com/800x600?text=Certificate+Variables+and+Data+Types"
  }
];

const Certificate = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(mockCertificates[0]);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = () => {
    setOpenShareDialog(true);
  };

  const handleVerify = () => {
    setOpenVerifyDialog(true);
  };

  const closeShareDialog = () => {
    setOpenShareDialog(false);
  };

  const closeVerifyDialog = () => {
    setOpenVerifyDialog(false);
    setVerificationCode('');
    setVerificationResult(null);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedCertificate.verificationCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleVerifyCertificate = () => {
    // Simulation de vérification
    const foundCertificate = mockCertificates.find(cert => cert.verificationCode === verificationCode);
    
    if (foundCertificate) {
      setVerificationResult({
        success: true,
        message: "Certificat authentique",
        certificate: foundCertificate
      });
    } else {
      setVerificationResult({
        success: false,
        message: "Code de vérification invalide ou certificat non trouvé"
      });
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
          Mes Certificats
        </Typography>
        
        <Grid container spacing={4}>
          {/* Liste des certificats */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Certificats obtenus
              </Typography>
              
              <List>
                {mockCertificates.map((cert) => (
                  <Paper 
                    key={cert.id} 
                    elevation={0} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 2,
                      bgcolor: selectedCertificate.id === cert.id ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                      border: selectedCertificate.id === cert.id ? '1px solid rgba(25, 118, 210, 0.2)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedCertificate(cert)}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUserIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={cert.title} 
                        secondary={`Délivré le: ${cert.issueDate}`}
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={handleVerify}
              >
                Vérifier un certificat
              </Button>
            </Paper>
          </Grid>
          
          {/* Détails du certificat sélectionné */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  {selectedCertificate.title}
                </Typography>
                
                <Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<ShareIcon />} 
                    sx={{ mr: 2 }}
                    onClick={handleShare}
                  >
                    Partager
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<DownloadIcon />}
                  >
                    Télécharger
                  </Button>
                </Box>
              </Box>
              
              {/* Aperçu du certificat */}
              <Box 
                component="img" 
                src={selectedCertificate.imageUrl}
                alt={`Certificat ${selectedCertificate.title}`}
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 3
                }}
              />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedCertificate.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>
                    Compétences acquises
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    {selectedCertificate.skills.map((skill, index) => (
                      <Typography 
                        key={index} 
                        variant="body1" 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mb: 0.5
                        }}
                      >
                        <CheckIcon color="success" sx={{ mr: 1 }} />
                        {skill}
                      </Typography>
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Délivré le
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedCertificate.issueDate}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                        Instructeur
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedCertificate.instructor}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
                        Code de vérification
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {selectedCertificate.verificationCode}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={handleCopyCode}
                          color={copySuccess ? "success" : "default"}
                        >
                          {copySuccess ? <CheckIcon /> : <ContentCopyIcon />}
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Dialogue de partage */}
      <Dialog open={openShareDialog} onClose={closeShareDialog}>
        <DialogTitle>Partager votre certificat</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Lien de partage
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                fullWidth
                size="small"
                value={`https://skillpath.com/verify/${selectedCertificate.verificationCode}`}
                InputProps={{
                  readOnly: true,
                }}
              />
              <IconButton>
                <ContentCopyIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Partager sur les réseaux sociaux
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <IconButton color="primary" size="large">
              <LinkedInIcon fontSize="large" />
            </IconButton>
            <IconButton color="info" size="large">
              <TwitterIcon fontSize="large" />
            </IconButton>
            <IconButton color="primary" size="large" sx={{ color: '#4267B2' }}>
              <FacebookIcon fontSize="large" />
            </IconButton>
            <IconButton color="error" size="large">
              <EmailIcon fontSize="large" />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeShareDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de vérification */}
      <Dialog open={openVerifyDialog} onClose={closeVerifyDialog}>
        <DialogTitle>Vérifier un certificat</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Entrez le code de vérification du certificat pour confirmer son authenticité.
          </Typography>
          
          <TextField
            fullWidth
            label="Code de vérification"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            sx={{ mb: 3 }}
          />
          
          <Button 
            variant="contained" 
            fullWidth
            onClick={handleVerifyCertificate}
            disabled={!verificationCode}
          >
            Vérifier
          </Button>
          
          {verificationResult && (
            <Box 
              sx={{ 
                mt: 3, 
                p: 2, 
                borderRadius: 1, 
                bgcolor: verificationResult.success ? 'success.light' : 'error.light',
                color: 'white'
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {verificationResult.message}
              </Typography>
              {verificationResult.success && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Certificat: {verificationResult.certificate.title}
                  <br />
                  Délivré le: {verificationResult.certificate.issueDate}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeVerifyDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Certificate;