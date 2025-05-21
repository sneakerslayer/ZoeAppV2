import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { TherapyModes } from '@/assets/images/therapy_modes';

interface TherapyModePickerProps {
  visible: boolean;
  onClose: () => void;
}

export default function TherapyModePicker({ visible, onClose }: TherapyModePickerProps) {
  const { colors } = useTheme();
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.content, { backgroundColor: colors.background }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Select Therapy Mode
          </Text>
          
          {TherapyModes.map((mode, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, { backgroundColor: colors.card }]}
              onPress={() => {
                onClose();
              }}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${mode.color}20` }]}>
                <Text style={[styles.icon, { color: mode.color }]}>
                  {mode.icon}
                </Text>
              </View>
              <View style={styles.optionContent}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  {mode.name}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.neutral[500] }]}>
                  {mode.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.neutral[100] }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: colors.neutral[700] }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 4,
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  closeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  closeButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});