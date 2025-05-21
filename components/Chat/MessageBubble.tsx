import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const { colors } = useTheme();
  const isAI = message.role === 'assistant';

  return (
    <View style={[
      styles.container,
      isAI ? { alignSelf: 'flex-start' } : { alignSelf: 'flex-end' }
    ]}>
      <View style={[
        styles.bubble,
        isAI 
          ? { backgroundColor: colors.neutral[100] }
          : { backgroundColor: colors.primary[500] }
      ]}>
        <Text style={[
          styles.text,
          isAI ? { color: colors.text } : { color: '#FFFFFF' }
        ]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
});