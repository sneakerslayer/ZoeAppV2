
import { render, act } from '@testing-library/react-native';
import { TherapyProvider, useTherapy } from '@/context/TherapyContext';
import { Text } from 'react-native';

const TestComponent = () => {
  const { currentMode, setMode } = useTherapy();
  return (
    <Text testID="mode" onPress={() => setMode('mindfulness')}>
      {currentMode}
    </Text>
  );
};

describe('TherapyContext', () => {
  it('provides default therapy mode', () => {
    const { getByTestId } = render(
      <TherapyProvider>
        <TestComponent />
      </TherapyProvider>
    );
    
    expect(getByTestId('mode').props.children).toBe('cognitive_behavioral');
  });

  it('allows changing therapy mode', () => {
    const { getByTestId } = render(
      <TherapyProvider>
        <TestComponent />
      </TherapyProvider>
    );
    
    act(() => {
      getByTestId('mode').props.onPress();
    });
    
    expect(getByTestId('mode').props.children).toBe('mindfulness');
  });
});
