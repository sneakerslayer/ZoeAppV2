
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const EMERGENCY_NUMBERS = {
  US: '911',
  SUICIDE_PREVENTION: '988',
};

export function CrisisAlert() {
  const { colors } = useTheme();

  const handleEmergencyCall = async (number: string) => {
    try {
      await Linking.openURL(`tel:${number}`);
    } catch (error) {
      console.error('Error making emergency call:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.error[100] }]}>
      <Text style={[styles.title, { color: colors.error[900] }]}>
        Need Immediate Help?
      </Text>
      <TouchableOpacity
        testID="emergency-call-button"
        style={[styles.button, { backgroundColor: colors.error[500] }]}
        onPress={() => handleEmergencyCall(EMERGENCY_NUMBERS.US)}
      >
        <Text style={styles.buttonText}>Call Emergency Services (911)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.error[500] }]}
        onPress={() => handleEmergencyCall(EMERGENCY_NUMBERS.SUICIDE_PREVENTION)}
      >
        <Text style={styles.buttonText}>Call 988 Suicide & Crisis Lifeline</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    margin: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
