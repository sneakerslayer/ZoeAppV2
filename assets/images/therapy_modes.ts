export type TherapyModeIcon = {
  name: string;
  description: string;
  icon: string;
  color: string;
};

export const TherapyModes: TherapyModeIcon[] = [
  {
    name: 'Daily Problems',
    description: 'Based on Cognitive Behavioral Therapy (CBT) principles',
    icon: 'calendar',
    color: '#0088FB', // primary.500
  },
  {
    name: 'Relationship Issues',
    description: 'Based on Psychodynamic approach',
    icon: 'heart',
    color: '#FF9100', // accent.500
  },
  {
    name: 'Negative Thought Patterns',
    description: 'Based on CBT + Mindfulness',
    icon: 'brain',
    color: '#10B981', // success.500
  },
  {
    name: 'Behavioral Changes',
    description: 'Based on Behavioral Therapy',
    icon: 'activity',
    color: '#F59E0B', // warning.500
  }
];