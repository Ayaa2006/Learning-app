import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà un token valide
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Vérifier si le token est expiré
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expiré
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }
        
        // Configurer le token dans les headers de l'API
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Récupérer les informations utilisateur
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Erreur d\'authentification:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email, password) => {
    try {
      setError(null);
      
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Stocker le token
      localStorage.setItem('token', token);
      
      // Configurer le token dans les headers de l'API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la connexion');
      return false;
    }
  };
  
  const register = async (userData) => {
    try {
      setError(null);
      
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      
      // Stocker le token
      localStorage.setItem('token', token);
      
      // Configurer le token dans les headers de l'API
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
      return false;
    }
  };
  
  const logout = () => {
    // Supprimer le token
    localStorage.removeItem('token');
    
    // Supprimer le token des headers
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
  };
  
  const updateProfile = async (userData) => {
    try {
      setError(null);
      
      const response = await api.put('/auth/profile', userData);
      setUser(response.data);
      
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du profil');
      return false;
    }
  };
  
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      
      await api.put('/auth/change-password', { currentPassword, newPassword });
      
      return true;
    } catch (error) {
      setError(error.response?.data?.message || 'Une erreur est survenue lors du changement de mot de passe');
      return false;
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;