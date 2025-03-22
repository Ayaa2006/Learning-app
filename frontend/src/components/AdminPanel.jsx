import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import AuthContext from '../contexts/AuthContext';
import api from '../services/api';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [activeSessions, setActiveSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialiser la connexion Socket.IO
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('Socket.IO connecté');
    });
    
    newSocket.on('proctor-alert', (alertData) => {
      handleRealTimeAlert(alertData);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Charger les sessions actives
  useEffect(() => {
    fetchActiveSessions();
    
    // Rafraîchir les sessions toutes les 30 secondes
    const interval = setInterval(fetchActiveSessions, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Charger les détails lorsqu'une session est sélectionnée
  useEffect(() => {
    if (selectedSession) {
      fetchSessionDetails(selectedSession.sessionId);
      
      // Rejoindre la salle Socket.IO pour cette session
      if (socket) {
        socket.emit('join-exam', selectedSession.exam.code);
      }
    }
  }, [selectedSession, socket]);

  // Fonction pour récupérer les sessions actives
  const fetchActiveSessions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/proctor/sessions/active');
      setActiveSessions(response.data.sessions);
    } catch (error) {
      console.error('Erreur lors du chargement des sessions actives:', error);
      toast.error('Impossible de charger les sessions actives');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer les détails d'une session
  const fetchSessionDetails = async (sessionId) => {
    try {
      setLoading(true);
      const response = await api.get(`/proctor/session/${sessionId}`);
      setAlerts(response.data.alerts);
    } catch (error) {
      console.error('Erreur lors du chargement des détails de la session:', error);
      toast.error('Impossible de charger les détails de la session');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les alertes en temps réel
  const handleRealTimeAlert = (alertData) => {
    toast.error(`Nouvelle alerte: ${alertData.alertMessage}`, {
      autoClose: false
    });
    
    // Ajouter l'alerte à la liste si c'est la session actuellement sélectionnée
    if (selectedSession && selectedSession.sessionId === alertData.sessionId) {
      setAlerts(prev => [
        ...prev,
        {
          type: alertData.alertType,
          message: alertData.alertMessage,
          timestamp: alertData.alertTimestamp,
          severity: alertData.alertSeverity,
          evidence: alertData.alertEvidence,
          reviewStatus: 'pending'
        }
      ]);
    }
    
    // Mettre à jour la liste des sessions actives
    fetchActiveSessions();
  };

  // Terminer une session
  const handleTerminateSession = async () => {
    if (!selectedSession) return;
    
    if (!window.confirm('Êtes-vous sûr de vouloir terminer cette session ? L\'étudiant ne pourra plus continuer son examen.')) {
      return;
    }
    
    try {
      await api.post(`/proctor/session/${selectedSession.sessionId}/terminate`, {
        reason: 'Terminée par l\'administrateur en raison de suspicion de fraude.'
      });
      
      toast.success('Session terminée avec succès');
      
      // Rafraîchir les sessions
      fetchActiveSessions();
      setSelectedSession(null);
      setAlerts([]);
    } catch (error) {
      console.error('Erreur lors de la terminaison de la session:', error);
      toast.error('Impossible de terminer la session');
    }
  };

  // Mettre à jour le statut d'une alerte
  const handleUpdateAlertStatus = async (alertId, status) => {
    try {
      await api.put(`/proctor/alert/${alertId}/status`, {
        status,
        notes: `Statut mis à jour par ${user.firstName} ${user.lastName}`
      });
      
      // Mettre à jour l'état local
      setAlerts(prev =>
        prev.map(alert =>
          alert._id === alertId ? { ...alert, reviewStatus: status } : alert
        )
      );
      
      toast.success(`Statut de l'alerte mis à jour: ${status}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Impossible de mettre à jour le statut');
    }
  };

  // Filtrer les alertes
  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'high' && alert.severity === 'high') return true;
    if (filter === 'medium' && alert.severity === 'medium') return true;
    if (filter === 'low' && alert.severity === 'low') return true;
    if (filter === 'pending' && alert.reviewStatus === 'pending') return true;
    if (filter === 'flagged' && alert.reviewStatus === 'flagged') return true;
    return false;
  });

  // Filtrer les sessions
  const filteredSessions = activeSessions.filter(session => {
    const searchFields = [
      session.student.firstName,
      session.student.lastName,
      session.student.email,
      session.exam.title,
      session.exam.code
    ].map(field => field.toLowerCase());
    
    return searchTerm === '' || searchFields.some(field => field.includes(searchTerm.toLowerCase()));
  });

  return (
    <Container>
      <Title>Surveillance des Examens en Temps Réel</Title>
      
      <PanelContainer>
        <SessionsPanel>
          <PanelHeader>
            <h2>Sessions Actives ({activeSessions.length})</h2>
            <SearchInput
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </PanelHeader>
          
          {loading && !activeSessions.length ? (
            <LoadingMessage>Chargement des sessions...</LoadingMessage>
          ) : filteredSessions.length === 0 ? (
            <NoDataMessage>
              {searchTerm ? 'Aucune session ne correspond à votre recherche' : 'Aucune session active'}
            </NoDataMessage>
          ) : (
            <SessionList>
              {filteredSessions.map(session => (
                <SessionItem
                  key={session.sessionId}
                  selected={selectedSession?.sessionId === session.sessionId}
                  onClick={() => setSelectedSession(session)}
                  hasAlerts={session.stats.totalAlerts > 0}
                >
                  <SessionHeader>
                    <StudentName>
                      {session.student.firstName} {session.student.lastName}
                    </StudentName>
                    <SessionTime>
                      Commencé à {new Date(session.startTime).toLocaleTimeString()}
                    </SessionTime>
                  </SessionHeader>
                  
                  <SessionInfo>
                    <ExamName>{session.exam.title}</ExamName>
                    <ExamCode>{session.exam.code}</ExamCode>
                  </SessionInfo>
                  
                  {session.stats.totalAlerts > 0 && (
                    <AlertBadge count={session.stats.totalAlerts}>
                      {session.stats.totalAlerts} alerte{session.stats.totalAlerts > 1 ? 's' : ''}
                    </AlertBadge>
                  )}
                </SessionItem>
              ))}
            </SessionList>
          )}
        </SessionsPanel>
        
        <DetailsPanel>
          {selectedSession ? (
            <>
              <PanelHeader>
                <h2>Détails de la session</h2>
                <TerminateButton onClick={handleTerminateSession}>
                  Terminer la session
                </TerminateButton>
              </PanelHeader>
              
              <SessionDetails>
                <DetailSection>
                  <DetailTitle>Étudiant</DetailTitle>
                  <DetailContent>
                    <p><strong>Nom:</strong> {selectedSession.student.firstName} {selectedSession.student.lastName}</p>
                    <p><strong>Email:</strong> {selectedSession.student.email}</p>
                  </DetailContent>
                </DetailSection>
                
                <DetailSection>
                  <DetailTitle>Examen</DetailTitle>
                  <DetailContent>
                    <p><strong>Titre:</strong> {selectedSession.exam.title}</p>
                    <p><strong>Code:</strong> {selectedSession.exam.code}</p>
                  </DetailContent>
                </DetailSection>
                
                <DetailSection>
                  <DetailTitle>Informations de session</DetailTitle>
                  <DetailContent>
                    <p><strong>ID:</strong> {selectedSession.sessionId}</p>
                    <p><strong>Début:</strong> {new Date(selectedSession.startTime).toLocaleString()}</p>
                    <p><strong>Durée:</strong> {formatDuration(new Date() - new Date(selectedSession.startTime))}</p>
                    <p><strong>Environnement:</strong> {selectedSession.environment.browser} / {selectedSession.environment.os}</p>
                    <p><strong>Résolution:</strong> {selectedSession.environment.screenResolution}</p>
                  </DetailContent>
                </DetailSection>
                
                <DetailSection>
                  <DetailTitle>Alertes</DetailTitle>
                  <FilterContainer>
                    <FilterLabel>Filtrer:</FilterLabel>
                    <FilterSelect
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">Toutes</option>
                      <option value="high">Sévérité élevée</option>
                      <option value="medium">Sévérité moyenne</option>
                      <option value="low">Sévérité faible</option>
                      <option value="pending">En attente</option>
                      <option value="flagged">Signalées</option>
                    </FilterSelect>
                  </FilterContainer>
                  
                  {loading ? (
                    <LoadingMessage>Chargement des alertes...</LoadingMessage>
                  ) : filteredAlerts.length === 0 ? (
                    <NoDataMessage>Aucune alerte pour cette session</NoDataMessage>
                  ) : (
                    <AlertList>
                      {filteredAlerts.map((alert, index) => (
                        <AlertItem key={index} severity={alert.severity}>
                          <AlertHeader>
                            <AlertType>{alert.type}</AlertType>
                            <AlertTime>
                              {new Date(alert.timestamp).toLocaleString()}
                            </AlertTime>
                          </AlertHeader>
                          
                          <AlertMessage>{alert.message}</AlertMessage>
                          
                          {alert.evidence && (
                            <EvidenceLink href={`/api/proctor/evidence/${alert._id}`} target="_blank">
                              Voir la capture d'écran
                            </EvidenceLink>
                          )}
                          
                          <AlertActions>
                            <AlertStatus status={alert.reviewStatus}>
                              {formatStatus(alert.reviewStatus)}
                            </AlertStatus>
                            
                            {alert.reviewStatus === 'pending' && (
                              <>
                                <ActionButton
                                  onClick={() => handleUpdateAlertStatus(alert._id, 'dismissed')}
                                  color="#6c757d"
                                >
                                  Ignorer
                                </ActionButton>
                                <ActionButton
                                  onClick={() => handleUpdateAlertStatus(alert._id, 'flagged')}
                                  color="#dc3545"
                                >
                                  Signaler
                                </ActionButton>
                              </>
                            )}
                          </AlertActions>
                        </AlertItem>
                      ))}
                    </AlertList>
                  )}
                </DetailSection>
              </SessionDetails>
            </>
          ) : (
            <NoSelectionMessage>
              Sélectionnez une session pour voir les détails
            </NoSelectionMessage>
          )}
        </DetailsPanel>
      </PanelContainer>
    </Container>
  );
};

// Fonction utilitaire pour formater la durée
const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
};

// Fonction pour formater le statut
const formatStatus = (status) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'reviewed':
      return 'Examinée';
    case 'dismissed':
      return 'Ignorée';
    case 'flagged':
      return 'Signalée';
    default:
      return status;
  }
};

// Styled components
const Container = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  color: #343a40;
`;

const PanelContainer = styled.div`
  display: flex;
  gap: 20px;
  height: calc(100vh - 150px);
  
  @media (max-width: 992px) {
    flex-direction: column;
    height: auto;
  }
`;

const Panel = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SessionsPanel = styled(Panel)`
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 992px) {
    max-width: 100%;
  }
`;

const DetailsPanel = styled(Panel)`
  flex: 2;
`;

const PanelHeader = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
    font-size: 18px;
    color: #343a40;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  width: 150px;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SessionList = styled.div`
  overflow-y: auto;
  flex-grow: 1;
`;

const SessionItem = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 1px solid #e9ecef;
  background-color: ${props => props.selected ? '#f8f9fa' : 'white'};
  border-left: 4px solid ${props => props.selected ? '#007bff' : props.hasAlerts ? '#dc3545' : 'transparent'};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const StudentName = styled.div`
  font-weight: 600;
`;

const SessionTime = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const SessionInfo = styled.div`
  margin-bottom: 10px;
`;

const ExamName = styled.div`
  font-size: 14px;
  margin-bottom: 2px;
`;

const ExamCode = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const AlertBadge = styled.div`
  display: inline-block;
  background-color: #dc3545;
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const TerminateButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
  }
`;

const SessionDetails = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
`;

const DetailSection = styled.div`
  margin-bottom: 25px;
`;

const DetailTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #343a40;
  padding-bottom: 5px;
  border-bottom: 1px solid #e9ecef;
`;

const DetailContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  
  p {
    margin: 5px 0;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  margin-right: 10px;
`;

const FilterSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #80bdff;
  }
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AlertItem = styled.div`
  background-color: ${props => {
    switch (props.severity) {
      case 'high': return 'rgba(220, 53, 69, 0.1)';
      case 'medium': return 'rgba(255, 193, 7, 0.1)';
      case 'low': return 'rgba(40, 167, 69, 0.1)';
      default: return 'rgba(108, 117, 125, 0.1)';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.severity) {
      case 'high': return '#dc3545';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#6c757d';
    }
  }};
  padding: 15px;
  border-radius: 4px;
`;

const AlertHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const AlertType = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

const AlertTime = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const AlertMessage = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
`;

const EvidenceLink = styled.a`
  display: inline-block;
  color: #007bff;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AlertActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AlertStatus = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: ${props => {
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'reviewed': return '#28a745';
      case 'dismissed': return '#6c757d';
      case 'flagged': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: ${props => {
    return ['pending', 'flagged'].includes(props.status) ? '#212529' : 'white';
  }};
  margin-right: auto;
`;

const ActionButton = styled.button`
  background-color: ${props => props.color || '#6c757d'};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    opacity: 0.9;
  }
`;

const NoSelectionMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  font-style: italic;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #6c757d;
`;

const NoDataMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
`;

export default AdminPanel;