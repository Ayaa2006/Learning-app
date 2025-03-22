import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const ExamQuestions = ({ currentQuestion, answer, onAnswerChange }) => {
  if (!currentQuestion) {
    return <NoQuestion>Aucune question disponible</NoQuestion>;
  }

  const renderAnswerInput = () => {
    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceContainer>
            {currentQuestion.options.map((option, index) => (
              <OptionItem key={index}>
                <RadioInput
                  type="radio"
                  id={`option-${index}`}
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={answer === option.id}
                  onChange={() => onAnswerChange(option.id)}
                />
                <OptionLabel htmlFor={`option-${index}`}>
                  {option.text}
                </OptionLabel>
              </OptionItem>
            ))}
          </MultipleChoiceContainer>
        );
      
      case 'checkbox':
        // Transformer la réponse en tableau si ce n'est pas déjà fait
        const selectedOptions = typeof answer === 'string' 
          ? answer.split(',').filter(Boolean) 
          : Array.isArray(answer) ? answer : [];
        
        const handleCheckboxChange = (optionId) => {
          const newSelectedOptions = [...selectedOptions];
          
          if (newSelectedOptions.includes(optionId)) {
            // Retirer l'option si déjà sélectionnée
            const index = newSelectedOptions.indexOf(optionId);
            newSelectedOptions.splice(index, 1);
          } else {
            // Ajouter l'option
            newSelectedOptions.push(optionId);
          }
          
          // Convertir en chaîne pour le stockage
          onAnswerChange(newSelectedOptions.join(','));
        };
        
        return (
          <MultipleChoiceContainer>
            {currentQuestion.options.map((option, index) => (
              <OptionItem key={index}>
                <CheckboxInput
                  type="checkbox"
                  id={`option-${index}`}
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleCheckboxChange(option.id)}
                />
                <OptionLabel htmlFor={`option-${index}`}>
                  {option.text}
                </OptionLabel>
              </OptionItem>
            ))}
          </MultipleChoiceContainer>
        );
      
      case 'text':
        return (
          <TextAnswerContainer>
            <TextAnswer
              value={answer || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Saisissez votre réponse ici..."
              rows={5}
            />
          </TextAnswerContainer>
        );
      
      case 'long_text':
        return (
          <TextAnswerContainer>
            <LongTextAnswer
              value={answer || ''}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Saisissez votre réponse détaillée ici..."
              rows={10}
            />
            <WordCount>{(answer || '').split(/\s+/).filter(Boolean).length} mots</WordCount>
          </TextAnswerContainer>
        );
      
      case 'file_upload':
        // Gestion simplifiée pour les uploads de fichiers
        const handleFileChange = async (e) => {
          const file = e.target.files[0];
          if (!file) return;
          
          // Dans un cas réel, vous utiliseriez ici un système d'upload
          // Pour cet exemple, on stocke juste le nom
          onAnswerChange(file.name);
        };
        
        return (
          <FileUploadContainer>
            <FileUploadLabel>
              {answer ? 'Fichier sélectionné:' : 'Sélectionnez un fichier:'}
            </FileUploadLabel>
            
            {answer && (
              <SelectedFile>
                <FileIcon>📄</FileIcon>
                <FileName>{answer}</FileName>
                <RemoveButton onClick={() => onAnswerChange('')}>
                  Supprimer
                </RemoveButton>
              </SelectedFile>
            )}
            
            {!answer && (
              <FileInput
                type="file"
                onChange={handleFileChange}
                accept={currentQuestion.fileTypes || '*'}
              />
            )}
            
            {currentQuestion.maxFileSize && (
              <FileConstraint>
                Taille maximale: {Math.round(currentQuestion.maxFileSize / (1024 * 1024))} Mo
              </FileConstraint>
            )}
            
            {currentQuestion.fileTypes && (
              <FileConstraint>
                Formats acceptés: {currentQuestion.fileTypes}
              </FileConstraint>
            )}
          </FileUploadContainer>
        );
      
      default:
        return <div>Type de question non supporté</div>;
    }
  };

  return (
    <QuestionContainer>
      <QuestionHeader>
        <QuestionNumber>Question {currentQuestion.order || 1}</QuestionNumber>
        <QuestionPoints>{currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}</QuestionPoints>
      </QuestionHeader>
      
      <QuestionContent>
        <ReactMarkdown>{currentQuestion.content}</ReactMarkdown>
        
        {currentQuestion.image && (
          <QuestionImage src={currentQuestion.image} alt="Illustration de la question" />
        )}
      </QuestionContent>
      
      <AnswerSection>
        <AnswerLabel>Votre réponse:</AnswerLabel>
        {renderAnswerInput()}
      </AnswerSection>
    </QuestionContainer>
  );
};

// Styled components
const QuestionContainer = styled.div`
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: white;
  flex-grow: 1;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 12px 20px;
  border-bottom: 1px solid #e9ecef;
`;

const QuestionNumber = styled.h2`
  margin: 0;
  font-size: 18px;
  color: #495057;
`;

const QuestionPoints = styled.div`
  background-color: #28a745;
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
`;

const QuestionContent = styled.div`
  padding: 20px;
  font-size: 16px;
  line-height: 1.6;
  color: #212529;
  
  p {
    margin-bottom: 15px;
  }
  
  code {
    background-color: #f8f9fa;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: Consolas, Monaco, 'Andale Mono', monospace;
    font-size: 0.9em;
  }
  
  pre {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
    margin-bottom: 15px;
  }
`;

const QuestionImage = styled.img`
  max-width: 100%;
  margin: 15px 0;
  border-radius: 4px;
  border: 1px solid #dee2e6;
`;

const AnswerSection = styled.div`
  padding: 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #e9ecef;
`;

const AnswerLabel = styled.div`
  font-weight: 600;
  margin-bottom: 15px;
  color: #495057;
`;

const MultipleChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: white;
  border: 1px solid #dee2e6;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f0f0f0;
  }
`;

const RadioInput = styled.input`
  margin-top: 3px;
  cursor: pointer;
`;

const CheckboxInput = styled.input`
  margin-top: 3px;
  cursor: pointer;
`;

const OptionLabel = styled.label`
  cursor: pointer;
  flex: 1;
`;

const TextAnswerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextAnswer = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1.5;
  resize: vertical;
  
  &:focus {
    border-color: #80bdff;
    outline: none;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const LongTextAnswer = styled(TextAnswer)`
  min-height: 200px;
`;

const WordCount = styled.div`
  margin-top: 8px;
  text-align: right;
  font-size: 12px;
  color: #6c757d;
`;

const FileUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileUploadLabel = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
`;

const FileInput = styled.input`
  background-color: white;
  padding: 10px;
  border: 1px dashed #ced4da;
  border-radius: 4px;
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
`;

const FileIcon = styled.div`
  font-size: 24px;
`;

const FileName = styled.div`
  flex: 1;
  word-break: break-all;
`;

const RemoveButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
  }
`;

const FileConstraint = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const NoQuestion = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  background-color: #f8f9fa;
  color: #6c757d;
  font-style: italic;
  border-radius: 8px;
  border: 1px dashed #ced4da;
`;

export default ExamQuestions;