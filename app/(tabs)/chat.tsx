import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useTherapy } from '@/context/TherapyContext';
import { router, useLocalSearchParams } from 'expo-router';
import { Send, Plus, CircleAlert as AlertCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import Container from '@/components/UI/Container';
import { Message } from '@/types';
import MessageBubble from '@/components/Chat/MessageBubble';
import TherapyModePicker from '@/components/UI/TherapyModePicker';
import EmergencyResourceButton from '@/components/UI/EmergencyResourceButton';
import { throttle } from '@/utils/performance';

export default function ChatScreen() {
  const { theme, colors } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    loadingResponse,
    therapyMode,
    setTherapyMode,
    messageCount,
    isPremium,
    messagesRemaining
  } = useTherapy();
  
  const [text, setText] = useState('');
  const [showModePicker, setShowModePicker] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const params = useLocalSearchParams();

  // Set therapy mode from URL params if provided
  useEffect(() => {
    if (params.mode && typeof params.mode === 'string') {
      const modeIndex = parseInt(params.mode, 10);
      if (!isNaN(modeIndex) && modeIndex >= 0 && modeIndex < 4) {
        setTherapyMode(modeIndex);
      }
    }
  }, [params.mode]);

  // Throttled send message function to prevent multiple rapid sends
  const handleSendMessage = throttle(() => {
    if (!text.trim()) return;
    
    if (!isAuthenticated) {
      router.push('/(auth)/login');
      return;
    }
    
    // Check if user has messages remaining
    if (!isPremium && messagesRemaining <= 0) {
      router.push('/premium');
      return;
    }
    
    sendMessage(text);
    setText('');
    Keyboard.dismiss();
  }, 500);

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);
  
  // Conversation starters
  const conversationStarters = [
    "I've been feeling anxious lately",
    "I'm having trouble sleeping",
    "I need help with work stress",
    "I'm struggling with a relationship"
  ];

  return (
    <Container>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            AI Therapy
          </Text>
          
          <TouchableOpacity 
            style={[styles.modeButton, { backgroundColor: colors.primary[50] }]}
            onPress={() => setShowModePicker(true)}
          >
            <Text style={[styles.modeButtonText, { color: colors.primary[500] }]}>
              {therapyMode}
            </Text>
          </TouchableOpacity>
        </View>
        
        {!isPremium && (
          <View style={[styles.messageCounter, { backgroundColor: colors.neutral[100] }]}>
            <Text style={[styles.messageCounterText, { color: colors.neutral[700] }]}>
              {messagesRemaining} of 3 free messages remaining today
            </Text>
            {messagesRemaining <= 1 && (
              <TouchableOpacity onPress={() => router.push('/premium')}>
                <Text style={[styles.upgradeText, { color: colors.primary[500] }]}>
                  Upgrade
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                Start your therapy session
              </Text>
              <Text style={[styles.emptyDescription, { color: colors.neutral[500] }]}>
                Begin by sharing how you're feeling or choose a conversation starter below
              </Text>
              
              <View style={styles.starters}>
                {conversationStarters.map((starter, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.starterButton, { backgroundColor: colors.neutral[100] }]}
                    onPress={() => setText(starter)}
                  >
                    <Text style={[styles.starterText, { color: colors.neutral[700] }]}>
                      {starter}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <EmergencyResourceButton />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messageList}
              renderItem={({ item }) => (
                <MessageBubble message={item} />
              )}
              onContentSizeChange={scrollToBottom}
              ListFooterComponent={
                loadingResponse ? (
                  <View style={[styles.loadingContainer, { backgroundColor: colors.primary[50] }]}>
                    <Text style={[styles.loadingText, { color: colors.primary[500] }]}>
                      AI is thinking
                    </Text>
                    <ActivityIndicator size="small" color={colors.primary[500]} />
                  </View>
                ) : null
              }
            />
          )}

          <View style={[styles.inputContainer, { 
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          }]}>
            {messages.length > 0 && (
              <EmergencyResourceButton mini />
            )}
            
            <View style={[styles.inputWrapper, { backgroundColor: colors.neutral[100] }]}>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Type your message..."
                placeholderTextColor={colors.neutral[400]}
                value={text}
                onChangeText={setText}
                multiline
                maxLength={1000}
              />
              <TouchableOpacity
                style={[styles.sendButton, { backgroundColor: colors.primary[500] }]}
                onPress={handleSendMessage}
                disabled={!text.trim() || loadingResponse}
              >
                <Send size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
        
        <TherapyModePicker 
          visible={showModePicker} 
          onClose={() => setShowModePicker(false)} 
        />
      </SafeAreaView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: 24,
  },
  modeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  messageCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  messageCounterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  upgradeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  keyboardAvoid: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  starters: {
    width: '100%',
    marginBottom: 32,
  },
  starterButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  starterText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  messageList: {
    padding: 16,
    paddingBottom: 24,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginLeft: 16,
    marginVertical: 8,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginRight: 8,
  },
  inputContainer: {
    borderTopWidth: 1,
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});