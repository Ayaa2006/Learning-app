import './index.css';
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';

// Context d'authentification
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Import des pages
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import AdminQCM from "./pages/AdminQCM";
import AdminExams from "./pages/AdminExams";
import Progress from "./pages/Progress";
import Certificate from "./pages/Certificate";
import Login from "./pages/Login";
import Courses from "./pages/Courses";
import CertificatesAdmin from "./pages/CertificatesAdmin";
import StudentDashboard from "./pages/StudentDashboard";
import WebcamTest from './pages/WebcamTest';
import Demo from './pages/Demo';
import Modules from './pages/Modules';
import ModuleDetails from './pages/ModuleDetails';
import ExamPage from './pages/ExamPage';
import ExamWithProctoring from './pages/ExamWithProctoring';
import NotFound from './pages/NotFound';
import AdminAnalytics from "./pages/AdminAnalytics";
import CreateCourse from "./pages/CreateCourse";
import CreateExam from "./pages/CreateExam";
import CreateQCM from "./pages/CreateQCM";
import TeacherDashboard from "./pages/TeacherDashboard";


// Configuration d'Axios pour les requêtes API
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Intercepteur pour ajouter le token à chaque requête
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  // État pour le mode sombre/clair
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) === true : false;
  });
  
  // Fonction pour basculer entre les modes
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
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
          secondary: {
            main: '#4caf50',
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
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [darkMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Home toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
            <Route path="/login" element={<Login toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
            <Route path="/webcam-test" element={<WebcamTest />} />
            <Route path="/demo" element={<Demo />} />
           
            
            {/* Routes étudiants - protégées */}
            <Route 
              path="/student-dashboard" 
              element={
                <ProtectedRoute>
                  <StudentDashboard toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/progress" 
              element={
                <ProtectedRoute>
                  <Progress toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/certificate" 
              element={
                <ProtectedRoute>
                  <Certificate toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/courses" 
              element={
                <ProtectedRoute>
                  <Courses toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/modules" 
              element={
                <ProtectedRoute>
                  <Modules toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/modules/:moduleId" 
              element={
                <ProtectedRoute>
                  <ModuleDetails toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ExamPage" 
              element={
                <ProtectedRoute>
                  <ExamPage toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ExamWithProctoring" 
              element={
                <ProtectedRoute>
                  <ExamWithProctoring toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            {/* Routes administratives - protégées avec permissions */}
            <Route 
    path="/teacher-dashboard" 
    element={
      <ProtectedRoute requiredPermissions={['viewDashboard']}>
        <TeacherDashboard toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </ProtectedRoute>
    } 
  />
  
  {/* Routes administratives - protégées avec permissions */}
  <Route 
    path="/admin-dashboard" 
    element={
      <ProtectedRoute requiredPermissions={['viewDashboard']}>
        <AdminDashboard toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      </ProtectedRoute>
    } 
  />
         
            <Route 
              path="/admin-courses" 
              element={
                <ProtectedRoute requiredPermissions={['viewCourses']}>
                  <AdminCourses toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-qcm" 
              element={
                <ProtectedRoute requiredPermissions={['viewQCM']}>
                  <AdminQCM toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-exams" 
              element={
                <ProtectedRoute requiredPermissions={['viewExams']}>
                  <AdminExams toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/certificats" 
              element={
                <ProtectedRoute requiredPermissions={['viewCertificates']}>
                  <CertificatesAdmin toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/analytics" 
              element={
                <ProtectedRoute requiredPermissions={['viewStatistics']}>
                  <AdminAnalytics toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-courses/create" 
              element={
                <ProtectedRoute requiredPermissions={['createCourse']}>
                  <CreateCourse toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-exams/create" 
              element={
                <ProtectedRoute requiredPermissions={['createExam']}>
                  <CreateExam toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-qcm/create" 
              element={
                <ProtectedRoute requiredPermissions={['createQCM']}>
                  <CreateQCM toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            {/* Redirection par défaut et page 404 */}
            <Route path="*" element={<NotFound toggleDarkMode={toggleDarkMode} darkMode={darkMode} />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;