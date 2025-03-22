import React from 'react';
import styled from 'styled-components';

const WarningModal = ({ isOpen, message, evidence, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Alerte de surveillance</ModalTitle>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <WarningMessage>{message}</WarningMessage>
          
          {evidence && (
            <EvidenceContainer>
              <EvidenceTitle>Capture d'écran de l'incident</EvidenceTitle>
              <EvidenceImage src={evidence} alt="Preuve de l'incident" />
            </EvidenceContainer>
          )}
          
          <WarningInstructions>
            Veuillez reprendre une position adéquate face à la caméra pour continuer l'examen. 
            Des incidents répétés seront signalés au responsable de l'examen.
          </WarningInstructions>
        </ModalBody>
        
        <ModalFooter>
          <AcknowledgeButton onClick={onClose}>J'ai compris</AcknowledgeButton>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

// Styled components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(-50px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #dc3545;
  color: white;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  
  &:hover {
    opacity: 0.8;
  }
`;

const ModalBody = styled.div`
  padding: 20px;
`;

const WarningMessage = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #dc3545;
`;

const EvidenceContainer = styled.div`
  margin: 15px 0;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  overflow: hidden;
`;

const EvidenceTitle = styled.div`
  background-color: #f8f9fa;
  padding: 8px 12px;
  font-size: 14px;
  border-bottom: 1px solid #dee2e6;
`;

const EvidenceImage = styled.img`
  width: 100%;
  display: block;
`;

const WarningInstructions = styled.div`
  font-size: 14px;
  color: #495057;
  margin-top: 15px;
  line-height: 1.5;
`;

const ModalFooter = styled.div`
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
`;

const AcknowledgeButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #c82333;
  }
`;

export default WarningModal;