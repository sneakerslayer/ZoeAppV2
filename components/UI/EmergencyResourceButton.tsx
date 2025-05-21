import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { CircleAlert as AlertCircle } from 'lucide-react-native';

interface EmergencyResourceButtonProps {
  mini?: boolean;
}

export default function EmergencyResourceButton({ mini = false }: EmergencyResourceButtonProps) {
  const { colors } = useTheme();
  
  if (mini) {
    return (
      <TouchableOpacity 
        style={[styles.miniButton, { backgroundColor: colors.error[50] }]}
      >
        <AlertCircle size={16} color={colors.error[500]} />
        <Text style={[styles.miniText, { color: colors.error[500] }]}>
          Emergency Resources
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.error[50] }]}
      >
        <AlertCircle size={20} color={colors.error[500]} style={styles.icon} />
        <View>
          <Text style={[styles.title, { color: colors.error[600] }]}>
            Need immediate help?
          </Text>
          <Text style={[styles.description, { color: colors.error[500] }]}>
            Access crisis resources and support lines
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  miniButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  miniText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginLeft: 4,
  },
});