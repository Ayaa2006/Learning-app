import './index.css';
import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ExamWithProctoring from './pages/ExamWithProctoring';
// Import des pages
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import AdminQCM from "./pages/AdminQCM";
import AdminExams from "./pages/AdminExams"; // Nouvelle page
import Progress from "./pages/Progress";
import Certificate from "./pages/Certificate";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import CertificatesAdmin from "./pages/CertificatesAdmin";
import StudentDashboard from "./pages/StudentDashboard"; // Nouvelle page
import WebcamTest from './pages/WebcamTest';
import Demo from './pages/Demo';
import Modules from './pages/Modules';
import ModuleDetails from './pages/ModuleDetails';
import ExamPage from './pages/ExamPage';


function App() {
  // État pour le mode sombre/clair
  const [darkMode, setDarkMode] = useState(false);
  
  // Fonction pour basculer entre les modes
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Création du thème en fonction du mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#ff9900',
          },
          background: {
            default: darkMode ? 'rgba(17, 22, 35, 0.95)' : '#f5f7fb',
            paper: darkMode ? 'rgba(26, 32, 46, 0.95)' : '#ffffff',
          },
          text: {
            primary: darkMode ? '#ffffff' : '#0a0e17',
            secondary: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
          }
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Home toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/student-dashboard" element={<StudentDashboard toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/admin-dashboard" element={<AdminDashboard toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/admin-courses" element={<AdminCourses toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/admin-qcm" element={<AdminQCM toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/admin-exams" element={<AdminExams toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/progress" element={<Progress toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/certificate" element={<Certificate toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/login" element={<Login toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/courses" element={<Courses toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/admin/certificats" element={<CertificatesAdmin toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          <Route path="/ExamWithProctoring" element={<ExamWithProctoring />} />
          <Route path="/webcam-test" element={<WebcamTest />} />
          <Route path="/Demo" element={<Demo />} />
          <Route path="/" element={<Modules />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/modules/:moduleId" element={<ModuleDetails />} />
          <Route path="*" element={<div>Page non trouvée</div>} />
          <Route path="/ExamPage" element={<ExamPage />} />
      
          

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;