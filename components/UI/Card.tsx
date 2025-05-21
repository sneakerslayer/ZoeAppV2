import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Card({ children, onPress, style }: CardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      testID="card"
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          boxShadow: `0px 2px 3.84px ${colors.shadow}`,
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    elevation: 3,
  },
});