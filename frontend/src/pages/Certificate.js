import React from "react";
import { Container, Typography, Button } from "@mui/material";

const Certificate = () => {
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">Gestion des Certificats 🎖️</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 3 }}>
        Générer un certificat
      </Button>
    </Container>
  );
};

export default Certificate;
