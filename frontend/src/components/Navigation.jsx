import React, { useState } from 'react';
import styled from 'styled-components';

const Navigation = ({ 
  currentIndex, 
  totalQuestions, 
  onPrev, 
  onNext, 
  onSave, 
  onSubmit, 
  isSaving 
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleSubmitClick = () => {
    setShowConfirmation(true);
  };
  
  const handleConfirmSubmit = () => {
    onSubmit();
    setShowConfirmation(false);
  };
  
  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };
  
  return (
    <NavigationContainer>
      <QuestionProgress>
        Question {currentIndex + 1} sur {totalQuestions}
      </QuestionProgress>
      
      <PaginationButtons>
        <PrevButton 
          onClick={onPrev} 
          disabled={currentIndex === 0}
        >
          <ButtonIcon>←</ButtonIcon>
          Question précédente
        </PrevButton>
        
        <NextButton 
          onClick={onNext} 
          disabled={currentIndex === totalQuestions - 1}
        >
          Question suivante
          <ButtonIcon>→</ButtonIcon>
        </NextButton>
      </PaginationButtons>
      
      <ActionButtons>
        <SaveButton 
          onClick={onSave} 
          disabled={isSaving}
        >
          {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
        </SaveButton>
        
        <SubmitButton 
          onClick={handleSubmitClick}
          disabled={showConfirmation}
        >
          Soumettre l'examen
        </SubmitButton>
      </ActionButtons>
      
      {showConfirmation && (
        <ConfirmationOverlay>
          <ConfirmationModal>
            <ConfirmTitle>Confirmer la soumission</ConfirmTitle>
            
            <ConfirmMessage>
              Êtes-vous sûr de vouloir soumettre cet examen ?
              <br />
              Cette action est irréversible.
            </ConfirmMessage>
            
            <ConfirmationInfo>
              Vous avez répondu à <span>{getCompletedQuestionsCount()}</span> question(s) sur {totalQuestions}.
            </ConfirmationInfo>
            
            <ConfirmButtons>
              <CancelButton onClick={handleCancelSubmit}>
                Annuler
              </CancelButton>
              
              <ConfirmButton onClick={handleConfirmSubmit}>
                Confirmer la soumission
              </ConfirmButton>
            </ConfirmButtons>
          </ConfirmationModal>
        </ConfirmationOverlay>
      )}
    </NavigationContainer>
  );
  
  // Fonction fictive pour compter les questions complétées
  function getCompletedQuestionsCount() {
    // Dans une implémentation réelle, cette information viendrait des props
    return Math.floor(Math.random() * (totalQuestions + 1));
  }
};

// Styled components
const NavigationContainer = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
`;

const QuestionProgress = styled.div`
  font-size: 14px;
  color: #6c757d;
  text-align: center;
`;

const PaginationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s, opacity 0.2s;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(Button)`
  background-color: #e9ecef;
  color: #495057;
  
  &:not(:disabled):hover {
    background-color: #dee2e6;
  }
`;

const NextButton = styled(Button)`
  background-color: #e9ecef;
  color: #495057;
  
  &:not(:disabled):hover {
    background-color: #dee2e6;
  }
`;

const ButtonIcon = styled.span`
  font-size: 18px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SaveButton = styled(Button)`
  background-color: #6c757d;
  color: white;
  
  &:not(:disabled):hover {
    background-color: #5a6268;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #28a745;
  color: white;
  
  &:not(:disabled):hover {
    background-color: #218838;
  }
`;

const ConfirmationOverlay = styled.div`
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

const ConfirmationModal = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const ConfirmTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #dc3545;
  font-size: 18px;
`;

const ConfirmMessage = styled.p`
  margin-bottom: 15px;
  line-height: 1.5;
`;

const ConfirmationInfo = styled.div`
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  
  span {
    font-weight: bold;
  }
`;

const ConfirmButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CancelButton = styled(Button)`
  background-color: #6c757d;
  color: white;
  
  &:hover {
    background-color: #5a6268;
  }
`;

const ConfirmButton = styled(Button)`
  background-color: #dc3545;
  color: white;
  
  &:hover {
    background-color: #c82333;
  }
`;

export default Navigation;