import './index.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import Progress from "./pages/Progress";
import Certificate from "./pages/Certificate";
import Login from "./pages/Login";
import AdminQCM from "./pages/AdminQCM";
import Courses from "./pages/Courses";
import CertificatesAdmin from "./pages/CertificatesAdmin";
import ExamWithProctoring from './pages/ExamWithProctoring';
import Demo from './pages/Demo';
import Modules from './pages/Modules';
import ModuleDetails from './pages/ModuleDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-courses" element={<AdminCourses />} />
        <Route path="AdminQCM" element={<AdminQCM />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/admin/certificats" element={<CertificatesAdmin />} />
        <Route path="/ExamWithProctoring" element={<ExamWithProctoring />} />
        <Route path="/Demo" element={<Demo/>} />
        <Route path="/modules" element={<Modules />} />
          <Route path="/modules/:moduleId" element={<ModuleDetails />} />
          <Route path="*" element={<div>Page non trouvée</div>} />
      </Routes>
    </Router>
  );
}

export default App;