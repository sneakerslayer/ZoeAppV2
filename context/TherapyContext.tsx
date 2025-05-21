import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types';
import { useAuth } from './AuthContext';
import { TherapyModes } from '@/assets/images/therapy_modes';

interface TherapyContextType {
  messages: Message[];
  loadingResponse: boolean;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  therapyMode: string;
  setTherapyMode: (index: number) => void;
  messageCount: number;
  isPremium: boolean;
  messagesRemaining: number;
}

const TherapyContext = createContext<TherapyContextType>({
  messages: [],
  loadingResponse: false,
  sendMessage: () => {},
  clearMessages: () => {},
  therapyMode: 'Daily Problems',
  setTherapyMode: () => {},
  messageCount: 0,
  isPremium: false,
  messagesRemaining: 3,
});

export const useTherapy = () => useContext(TherapyContext);

export const TherapyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [therapyModeIndex, setTherapyModeIndex] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [messagesRemaining, setMessagesRemaining] = useState(3);
  const [isPremium, setIsPremium] = useState(false);
  
  // Mock AI responses based on therapy mode
  const getMockResponse = (prompt: string, mode: string): string => {
    switch (mode) {
      case 'Daily Problems':
        return "I understand you're dealing with some daily challenges. Let's break this down using a CBT approach. What specific thoughts come up when you face this problem?";
      case 'Relationship Issues':
        return "Thank you for sharing that relationship concern. From a psychodynamic perspective, I'm curious how this might relate to your early relationship experiences?";
      case 'Negative Thought Patterns':
        return "I notice there might be some negative thought patterns here. Let's practice mindfulness first. Take a deep breath, and then we can examine these thoughts with curiosity rather than judgment.";
      case 'Behavioral Changes':
        return "If you're looking to change this behavior, we should start by identifying the triggers and consequences. What typically happens right before this behavior occurs?";
      default:
        return "I'm here to listen and support you. Could you tell me more about what you're experiencing?";
    }
  };
  
  const sendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoadingResponse(true);
    setMessageCount(prev => prev + 1);
    
    // Reduce remaining messages count for free users
    if (!isPremium) {
      setMessagesRemaining(prev => Math.max(0, prev - 1));
    }
    
    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: uuidv4(),
        content: getMockResponse(content, TherapyModes[therapyModeIndex].name),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setLoadingResponse(false);
    }, 1500);
  };
  
  const clearMessages = () => {
    setMessages([]);
  };
  
  const setTherapyMode = (index: number) => {
    if (index >= 0 && index < TherapyModes.length) {
      setTherapyModeIndex(index);
    }
  };
  
  return (
    <TherapyContext.Provider
      value={{
        messages,
        loadingResponse,
        sendMessage,
        clearMessages,
        therapyMode: TherapyModes[therapyModeIndex].name,
        setTherapyMode,
        messageCount,
        isPremium,
        messagesRemaining,
      }}
    >
      {children}
    </TherapyContext.Provider>
  );
};