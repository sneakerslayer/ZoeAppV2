import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import * as FileSystem from 'expo-file-system';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  status: 'sending' | 'sent' | 'error';
}

interface TherapyContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  therapyMode: string;
  setTherapyMode: (index: number) => void;
  messageCount: number;
  isPremium: boolean;
  messagesRemaining: number;
  retryMessage: (messageId: string) => Promise<void>;
}

const TherapyContext = createContext<TherapyContextType | null>(null);

export function TherapyProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [therapyModeIndex, setTherapyModeIndex] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const isPremium = user?.isPremium ?? false;
  const [messagesRemaining, setMessagesRemaining] = useState(3);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const path = `${FileSystem.documentDirectory}messages.json`;
      const fileExists = await FileSystem.getInfoAsync(path);
      
      if (fileExists.exists) {
        const content = await FileSystem.readAsStringAsync(path);
        setMessages(JSON.parse(content));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const saveMessages = async (newMessages: Message[]) => {
    try {
      const path = `${FileSystem.documentDirectory}messages.json`;
      await FileSystem.writeAsStringAsync(path, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sending',
    };
    
    setMessages(prev => [...prev, userMessage]);
    setLoadingResponse(true);
    setMessageCount(prev => prev + 1);
    
    if (!isPremium) {
      setMessagesRemaining(prev => Math.max(0, prev - 1));
    }
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.tokens?.accessToken}`,
        },
        body: JSON.stringify({
          message: content,
          therapyMode: TherapyModes[therapyModeIndex].name,
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');

      const aiResponse: Message = {
        id: uuidv4(),
        content: await response.text(),
        sender: 'ai',
        timestamp: new Date().toISOString(),
        status: 'sent',
      };
      
      const updatedMessages = [...messages, userMessage, aiResponse];
      setMessages(updatedMessages);
      await saveMessages(updatedMessages);
    } catch (error) {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'error' }
            : msg
        )
      );
    } finally {
      setLoadingResponse(false);
    }
  };

  const retryMessage = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    setMessages(prev => 
      prev.filter(m => m.id !== messageId)
    );
    
    await sendMessage(message.content);
  };

  const clearMessages = async () => {
    setMessages([]);
    await saveMessages([]);
  };

  const TherapyModes = [
    { name: 'Daily Problems' },
    { name: 'Depression' },
    { name: 'Anxiety' },
  ];

  const value = {
    messages,
    loadingResponse,
    sendMessage,
    clearMessages,
    therapyMode: TherapyModes[therapyModeIndex].name,
    setTherapyMode: setTherapyModeIndex,
    messageCount,
    isPremium,
    messagesRemaining,
    retryMessage,
  };

  return (
    <TherapyContext.Provider value={value}>
      {children}
    </TherapyContext.Provider>
  );
}

export function useTherapy() {
  const context = useContext(TherapyContext);
  if (!context) {
    throw new Error('useTherapy must be used within a TherapyProvider');
  }
  return context;
}