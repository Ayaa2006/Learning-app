// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Pages publiques
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

// Pages d'interface étudiant
import StudentDashboard from '../pages/StudentDashboard';
import CoursePage from '../pages/CoursePage';
import ProgressPage from '../pages/ProgressPage';
import ExamPage from '../pages/ExamPage';
import ExamWithProctoring from '../pages/ExamWithProctoring';
import CertificatePage from '../pages/CertificatePage';

// Pages d'administration
import AdminDashboard from '../pages/AdminDashboard';
import AdminCourses from '../pages/AdminCourses';
import CreateCourse from '../pages/CreateCourse';
import AdminQCM from '../pages/AdminQCM';
import AdminExams from '../pages/AdminExams';
import AdminCertificates from '../pages/CertificatesAdmin';
import AdminUserManagement from '../pages/AdminUserManagement';
import AdminSettings from '../pages/AdminSettings';
import AdminAnalytics from '../pages/AdminAnalytics';


const AppRoutes = () => {
  const { ROLES } = useAuth();
  
  return (
    <Routes>
      <Route path="/admin/users" element={<UsersManagement />} />
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Routes étudiants */}
      <Route path="/student-dashboard" element={
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/progress" element={
        <ProtectedRoute>
          <ProgressPage />
        </ProtectedRoute>
      } />
      <Route path="/course/:id" element={
        <ProtectedRoute>
          <CoursePage />
        </ProtectedRoute>
      } />
      <Route path="/exam/:id" element={
        <ProtectedRoute>
          <ExamPage />
        </ProtectedRoute>
      } />
      <Route path="/exam-proctored/:id" element={
        <ProtectedRoute>
          <ExamWithProctoring />
        </ProtectedRoute>
      } />
      <Route path="/certificate" element={
        <ProtectedRoute>
          <CertificatePage />
        </ProtectedRoute>
      } />
      
      {/* Routes d'administration */}
      
      {/* Tableau de bord admin - accessible aux administrateurs et professeurs */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute 
          requiredPermissions={['viewDashboard']}
        >
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Gestion des cours - accessible aux administrateurs et professeurs */}
      <Route path="/admin-courses" element={
        <ProtectedRoute 
          requiredPermissions={['viewCourses']}
        >
          <AdminCourses />
        </ProtectedRoute>
      } />
      
      {/* Création de cours - nécessite la permission de création */}
      <Route path="/admin-courses/create" element={
        <ProtectedRoute 
          requiredPermissions={['createCourse']}
        >
          <CreateCourse />
        </ProtectedRoute>
      } />
      
      {/* Gestion des QCM - accessible aux administrateurs et professeurs */}
      <Route path="/admin-qcm" element={
        <ProtectedRoute 
          requiredPermissions={['viewQCM']}
        >
          <AdminQCM />
        </ProtectedRoute>
      } />
      
      {/* Gestion des examens - accessible aux administrateurs et professeurs */}
      <Route path="/admin-exams" element={
        <ProtectedRoute 
          requiredPermissions={['viewExams']}
        >
          <AdminExams />
        </ProtectedRoute>
      } />
      
      {/* Gestion des certificats - accessible aux administrateurs et professeurs */}
      <Route path="/admin/certificats" element={
        <ProtectedRoute 
          requiredPermissions={['viewCertificates']}
        >
          <AdminCertificates />
        </ProtectedRoute>
      } />
      
      {/* Statistiques - accessible aux administrateurs et professeurs */}
      <Route path="/admin/analytics" element={
        <ProtectedRoute 
          requiredPermissions={['viewStatistics']}
        >
          <AdminAnalytics />
        </ProtectedRoute>
      } />
      
      {/* Gestion des utilisateurs - réservée aux administrateurs système */}
      <Route path="/admin/users" element={
        <ProtectedRoute 
          requiredPermissions={['manageUsers']}
          requiredRole={ROLES.ADMIN}
        >
          <AdminUserManagement />
        </ProtectedRoute>
      } />
      
      {/* Paramètres - réservée aux administrateurs système */}
      <Route path="/admin/settings" element={
        <ProtectedRoute 
          requiredPermissions={['manageRoles']}
          requiredRole={ROLES.ADMIN}
        >
          <AdminSettings />
        </ProtectedRoute>
      } />
      
      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Page 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;