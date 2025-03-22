import React, { createContext, useState } from 'react';

const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [examData, setExamData] = useState(null);
  const [isProctored, setIsProctored] = useState(false);
  const [examProgress, setExamProgress] = useState({
    answers: {},
    currentQuestion: 0,
    timeLeft: 0
  });
  
  const updateAnswer = (questionId, answer) => {
    setExamProgress(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }));
  };
  
  const setCurrentQuestion = (index) => {
    setExamProgress(prev => ({
      ...prev,
      currentQuestion: index
    }));
  };
  
  const setTimeLeft = (seconds) => {
    setExamProgress(prev => ({
      ...prev,
      timeLeft: seconds
    }));
  };
  
  const resetExamState = () => {
    setExamData(null);
    setIsProctored(false);
    setExamProgress({
      answers: {},
      currentQuestion: 0,
      timeLeft: 0
    });
  };
  
  return (
    <ExamContext.Provider
      value={{
        examData,
        setExamData,
        isProctored,
        setIsProctored,
        examProgress,
        updateAnswer,
        setCurrentQuestion,
        setTimeLeft,
        resetExamState
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export default ExamContext;