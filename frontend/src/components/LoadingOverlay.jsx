import React from 'react';
import styled, { keyframes } from 'styled-components';

const LoadingOverlay = ({ progress }) => {
  return (
    <Overlay>
      <LoadingContainer>
        <LoadingTitle>Initialisation du système de surveillance</LoadingTitle>
        <LoadingText>Chargement des modèles d'analyse...</LoadingText>
        
        <ProgressBarContainer>
          <ProgressBar width={progress} />
        </ProgressBarContainer>
        
        <ProgressText>{progress}%</ProgressText>
        
        <LoadingInfo>
          {progress < 30 ? (
            "Initialisation des modèles de détection de visage..."
          ) : progress < 70 ? (
            "Chargement des modèles d'analyse faciale..."
          ) : progress < 90 ? (
            "Chargement des modèles de détection d'objets..."
          ) : (
            "Finalisation de l'initialisation..."
          )}
        </LoadingInfo>
      </LoadingContainer>
    </Overlay>
  );
};

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
`;

// Styled components
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const LoadingTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #343a40;
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 15px;
`;

const ProgressBarContainer = styled.div`
  height: 6px;
  background-color: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background-color: #007bff;
  border-radius: 4px;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 15px;
`;

const LoadingInfo = styled.div`
  font-size: 12px;
  color: #6c757d;
  animation: ${pulse} 2s infinite;
`;

export default LoadingOverlay;