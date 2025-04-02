// src/pages/Certificate.jsx
import React, { useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    logoUrl: "/images/login-illustration__2_-removebg-preview (1).png",
    studentName: "Jean Dupont",
    bgColor: "#f8f9ff"
  },
  {
    id: 2,
    title: "Variables et Types de Données",
    issueDate: "2025-03-08",
    verificationCode: "CERT-D4E5F6",
    instructor: "Prof. Sarah Johnson",
    skills: ["Types de données", "Manipulation de variables", "Opérateurs"],
    description: "Ce certificat atteste de la maîtrise des variables et types de données, comprenant la déclaration et la manipulation de variables, les types primitifs et les opérateurs.",
    logoUrl: "/images/login-illustration__2_-removebg-preview (1).png",
    studentName: "Jean Dupont",
    bgColor: "#f5f9f7"
  }
];

const Certificate = () => {
  const [selectedCertificate, setSelectedCertificate] = useState(mockCertificates[0]);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const certificateRef = useRef(null);

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
    showSnackbar('Code copié avec succès !', 'success');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://skillpath.com/verify/${selectedCertificate.verificationCode}`);
    showSnackbar('Lien copié avec succès !', 'success');
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

  
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Fonction améliorée pour télécharger le certificat
  const downloadCertificateAsImage = () => {
    // Afficher un message indiquant le début du téléchargement
    setSnackbarMessage('Préparation du téléchargement...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    
    // Vérifier si le certificat est présent
    if (!certificateRef.current) {
      setSnackbarMessage('Erreur: Impossible de trouver le certificat à télécharger.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    // Options améliorées pour html2canvas
    const options = {
      scale: 2, // Meilleure qualité
      useCORS: true, // Pour permettre le chargement d'images externes
      allowTaint: true,
      backgroundColor: selectedCertificate.bgColor || '#fff',
      logging: false, // Désactiver les logs pour améliorer les performances
      imageTimeout: 0, // Pas de timeout pour le chargement des images
      onclone: (clonedDoc) => {
        // Vous pouvez manipuler le clone du DOM avant capture si nécessaire
        const clonedCert = clonedDoc.querySelector('#certificateContainer');
        if (clonedCert) {
          // Assurez-vous que tous les éléments sont bien visibles
          clonedCert.style.width = '100%';
          clonedCert.style.height = 'auto';
          clonedCert.style.overflow = 'visible';
        }
      }
    };
    
    try {
      // Utiliser html2canvas avec gestion d'erreur améliorée
      html2canvas(certificateRef.current, options)
        .then(canvas => {
          try {
            // Format de type image/jpeg pour une meilleure compatibilité
            const dataURL = canvas.toDataURL('image/jpeg', 0.95); // 95% de qualité
            
            // Créer un lien de téléchargement
            const downloadLink = document.createElement('a');
            downloadLink.href = dataURL;
            downloadLink.download = `${selectedCertificate.title.replace(/[^a-z0-9]/gi, '_')}_Certificat.jpg`;
            
            // Déclencher le téléchargement
            document.body.appendChild(downloadLink);
            downloadLink.click();
            
            // Nettoyer
            setTimeout(() => {
              document.body.removeChild(downloadLink);
              URL.revokeObjectURL(dataURL);
            }, 100);
            
            // Notification de succès
            setSnackbarMessage('Certificat téléchargé avec succès !');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
          } catch (error) {
            console.error('Erreur lors de la conversion en image:', error);
            setSnackbarMessage('Erreur lors de la génération de l\'image. Détails: ' + error.message);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
          }
        })
        .catch(error => {
          console.error('Erreur avec html2canvas:', error);
          setSnackbarMessage('Erreur lors de la capture du certificat. Détails: ' + error.message);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        });
    } catch (error) {
      console.error('Erreur globale:', error);
      setSnackbarMessage('Une erreur inattendue s\'est produite. Détails: ' + error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Pour générer un PDF si nécessaire
  const downloadCertificateAsPDF = () => {
    setSnackbarMessage('Préparation du PDF...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    
    if (certificateRef.current) {
      html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: selectedCertificate.bgColor || '#fff'
      }).then(canvas => {
        try {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          });
          
          // Calculer les dimensions pour ajuster l'image au format PDF
          const imgWidth = 277; // Largeur de la page A4 en mode paysage (mm)
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
          pdf.save(`${selectedCertificate.title}_Certificat.pdf`);
          
          setSnackbarMessage('Certificat PDF téléchargé avec succès !');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
        } catch (error) {
          console.error('Erreur lors de la génération du PDF:', error);
          setSnackbarMessage('Erreur lors de la création du PDF.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }).catch(error => {
        console.error('Erreur avec html2canvas:', error);
        setSnackbarMessage('Erreur lors de la capture du certificat.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fb', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', color: '#1a237e' }}>
          Mes Certificats
        </Typography>
        
        <Grid container spacing={4}>
          {/* Liste des certificats */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a237e' }}>
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
                      bgcolor: selectedCertificate.id === cert.id ? 'rgba(25, 118, 210, 0.08)' : 'white',
                      border: selectedCertificate.id === cert.id ? '1px solid rgba(25, 118, 210, 0.2)' : '1px solid #eaeaea',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.05)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)'
                      }
                    }}
                    onClick={() => setSelectedCertificate(cert)}
                  >
                    <ListItem>
                      <ListItemIcon>
                        <VerifiedUserIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {cert.title}
                          </Typography>
                        }
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
                sx={{ 
                  mt: 2,
                  py: 1.2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)',
                  '&:hover': {
                    boxShadow: '0 6px 10px rgba(25, 118, 210, 0.3)',
                  }
                }}
                onClick={handleVerify}
              >
                Vérifier un certificat
              </Button>
            </Paper>
          </Grid>
          
          {/* Détails du certificat sélectionné */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
                  {selectedCertificate.title}
                </Typography>
                
                <Box>
                  <Button 
                    variant="outlined" 
                    startIcon={<ShareIcon />} 
                    sx={{ 
                      mr: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 1.5
                    }}
                    onClick={handleShare}
                  >
                    Partager
                  </Button>
                  <Button 
                    variant="contained" 
                    startIcon={<DownloadIcon />}
                    sx={{ 
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 1.5,
                      boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 10px rgba(25, 118, 210, 0.3)',
                      }
                    }}
                    onClick={downloadCertificateAsImage}
                  >
                    Télécharger
                  </Button>
                </Box>
              </Box>
              
              {/* Aperçu du certificat */}
              <Box 
                id="certificateContainer"
                ref={certificateRef}
                sx={{ 
                  width: '100%', 
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  mb: 3,
                  p: 4,
                  position: 'relative',
                  bgcolor: selectedCertificate.bgColor || '#fff',
                  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.02)',
                  overflow: 'hidden'
                }}
              >
                {/* Élément décoratif */}
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
                  zIndex: 0
                }} />
                
                <Box sx={{
                  position: 'absolute',
                  bottom: -20,
                  left: -20,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
                  zIndex: 0
                }} />
                
                {/* Contenu du certificat */}
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  {/* En-tête */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box 
                      component="img" 
                      src={selectedCertificate.logoUrl || "https://via.placeholder.com/150x50?text=Logo"}
                      alt="Logo"
                      sx={{ height: 70, width: 'auto' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Code: {selectedCertificate.verificationCode}
                    </Typography>
                  </Box>
                  
                  {/* Titre */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="overline" display="block" color="primary" gutterBottom>
                      Certificat d'achèvement
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: '#1a237e', mb: 1, fontFamily: "'Playfair Display', serif" }}>
                      {selectedCertificate.title}
                    </Typography>
                    <Divider sx={{ 
                      width: '50%', 
                      mx: 'auto', 
                      my: 2,
                      borderColor: 'primary.light',
                      '&::before, &::after': {
                        borderTop: '1px solid rgba(25, 118, 210, 0.3)',
                      }
                    }}>
                      <CheckIcon color="primary" fontSize="small" />
                    </Divider>
                  </Box>
                  
                  {/* Corps */}
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="body1" paragraph>
                      Ce certificat est décerné à
                    </Typography>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 600, fontStyle: 'italic', mb: 2 }}>
                      {selectedCertificate.studentName}
                    </Typography>
                    <Typography variant="body1" sx={{ maxWidth: '80%', mx: 'auto' }}>
                      pour avoir complété avec succès la formation et démontré les compétences requises en 
                      <Box component="span" sx={{ fontWeight: 600, fontStyle: 'italic' }}> {selectedCertificate.title}</Box>
                    </Typography>
                  </Box>
                  
                  {/* Pied */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 6 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ 
                        width: 150, 
                        borderBottom: '1px solid #1a237e',
                        mb: 1
                      }} />
                      <Typography variant="body2">Signature de l'instructeur</Typography>
                      <Typography variant="body2">{selectedCertificate.instructor}</Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2">Délivré le {selectedCertificate.issueDate}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e' }}>
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedCertificate.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a237e', mt: 2 }}>
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
                  <Card variant="outlined" sx={{ mb: 2, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
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
      <Dialog open={openShareDialog} onClose={closeShareDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1a237e' }}>Partager votre certificat</DialogTitle>
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
              <IconButton onClick={handleCopyLink}>
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
          <Button onClick={closeShareDialog} sx={{ textTransform: 'none', fontWeight: 600 }}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Dialogue de vérification */}
      <Dialog open={openVerifyDialog} onClose={closeVerifyDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: '#1a237e' }}>Vérifier un certificat</DialogTitle>
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
            sx={{ 
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600
            }}
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
          <Button onClick={closeVerifyDialog} sx={{ textTransform: 'none', fontWeight: 600 }}>Fermer</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar pour les notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Certificate;