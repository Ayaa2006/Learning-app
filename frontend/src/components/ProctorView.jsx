import React, { useRef, useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import { toast } from 'react-toastify';
import proctoringService from '../services/proctoring';
import ExamContext from '../contexts/ExamContext';
import WarningModal from './WarningModal';
import LoadingOverlay from './LoadingOverlay';

const ProctorView = ({ examId, studentId }) => {
  const webcamRef = useRef(null);
  const { setIsProctored } = useContext(ExamContext);
  
  // États locaux
  const [status, setStatus] = useState({ type: 'info', message: 'Initialisation...' });
  const [warnings, setWarnings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ message: '', evidence: '' });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialiser le service de proctoring
  useEffect(() => {
    const initProctoring = async () => {
      // Enregistrer les callbacks
      proctoringService.registerCallbacks({
        onWarning: handleWarning,
        onStatusChange: handleStatusChange,
        onCriticalWarning: handleCriticalWarning,
        onModelLoadProgress: handleModelLoadProgress
      });

      try {
        // Initialiser le service
        const success = await proctoringService.initialize(webcamRef, examId, studentId);
        
        if (success) {
          setStatus({ type: 'success', message: 'Surveillance active' });
          setIsProctored(true);
        } else {
          setStatus({ type: 'error', message: 'Échec de l\'initialisation' });
          toast.error('Impossible d\'initialiser la surveillance. Veuillez vérifier votre caméra.');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        setStatus({ type: 'error', message: 'Erreur d\'initialisation' });
        toast.error('Une erreur est survenue. Veuillez actualiser la page.');
      } finally {
        setIsLoading(false);
      }
    };

    initProctoring();

    // Nettoyer lors du démontage du composant
    return () => {
      proctoringService.stopDetection();
    };
  }, [examId, studentId, setIsProctored]);

  // Gérer les avertissements
  const handleWarning = (message) => {
    const time = new Date().toLocaleTimeString();
    setWarnings(prev => [{ id: Date.now(), time, message }, ...prev].slice(0, 5));
    toast.warning(message);
  };

  // Gérer les changements de statut
  const handleStatusChange = (type, message) => {
    setStatus({ type, message });
    
    if (type === 'error') {
      toast.error(message);
    } else if (type === 'warning') {
      toast.warning(message);
    }
  };

  // Gérer les avertissements critiques
  const handleCriticalWarning = (message, evidence) => {
    setModalData({ message, evidence });
    setIsModalOpen(true);
  };

  // Gérer le progrès de chargement des modèles
  const handleModelLoadProgress = (progress) => {
    setLoadingProgress(progress);
  };

  // Gérer la fermeture du modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      {isLoading && <LoadingOverlay progress={loadingProgress} />}
      
      <WebcamContainer>
        <Webcam
          ref={webcamRef}
          audio={false}
          width={320}
          height={240}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user"
          }}
        />
      </WebcamContainer>

      <StatusIndicator status={status.type}>
        {status.message}
      </StatusIndicator>

      <WarningsContainer>
        <WarningTitle>Historique des alertes</WarningTitle>
        {warnings.length === 0 ? (
          <NoWarnings>Aucune alerte pour le moment</NoWarnings>
        ) : (
          warnings.map(warning => (
            <Warning key={warning.id}>
              <WarningTime>{warning.time}</WarningTime>
              <WarningMessage>{warning.message}</WarningMessage>
            </Warning>
          ))
        )}
      </WarningsContainer>

      <WarningModal
        isOpen={isModalOpen}
        message={modalData.message}
        evidence={modalData.evidence}
        onClose={handleCloseModal}
      />
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  background-color: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const WebcamContainer = styled.div`
  background-color: #000;
  width: 100%;
  height: 240px;
  overflow: hidden;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StatusIndicator = styled.div`
  padding: 8px;
  text-align: center;
  font-weight: bold;
  background-color: ${props => {
    switch (props.status) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#007bff';
    }
  }};
  color: ${props => props.status === 'warning' ? '#212529' : '#fff'};
`;

const WarningsContainer = styled.div`
  padding: 10px;
  background-color: #fff;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 200px;
`;

const WarningTitle = styled.h3`
  font-size: 14px;
  margin-bottom: 10px;
  color: #495057;
`;

const NoWarnings = styled.div`
  font-size: 13px;
  color: #6c757d;
  font-style: italic;
`;

const Warning = styled.div`
  padding: 8px;
  margin-bottom: 8px;
  background-color: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  border-radius: 4px;
`;

const WarningTime = styled.div`
  font-size: 11px;
  color: #6c757d;
  margin-bottom: 2px;
`;

const WarningMessage = styled.div`
  font-size: 13px;
  color: #212529;
`;

export default ProctorView;