
import { render, fireEvent } from '@testing-library/react-native';
import TherapyModePicker from '@/components/UI/TherapyModePicker';
import { ThemeProvider } from '@/context/ThemeContext';
import { TherapyProvider } from '@/context/TherapyContext';

describe('TherapyModePicker', () => {
  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <TherapyProvider>
          <TherapyModePicker />
        </TherapyProvider>
      </ThemeProvider>
    );
  };

  it('renders therapy mode options', () => {
    const { getByText } = renderComponent();
    expect(getByText('Cognitive Behavioral')).toBeTruthy();
    expect(getByText('Mindfulness')).toBeTruthy();
  });

  it('handles mode selection', () => {
    const { getByText } = renderComponent();
    const modeButton = getByText('Cognitive Behavioral');
    fireEvent.press(modeButton);
    // Add assertions based on your implementation
  });
});
