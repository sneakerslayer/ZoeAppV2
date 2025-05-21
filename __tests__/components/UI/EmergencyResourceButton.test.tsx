
import { render, fireEvent } from '@testing-library/react-native';
import EmergencyResourceButton from '@/components/UI/EmergencyResourceButton';
import { ThemeProvider } from '@/context/ThemeContext';

describe('EmergencyResourceButton', () => {
  const mockOnPress = jest.fn();

  const renderButton = (props = {}) => {
    return render(
      <ThemeProvider>
        <EmergencyResourceButton
          title="Emergency Help"
          onPress={mockOnPress}
          {...props}
        />
      </ThemeProvider>
    );
  };

  it('renders with correct title', () => {
    const { getByText } = renderButton();
    expect(getByText('Emergency Help')).toBeTruthy();
  });

  it('handles press events', () => {
    const { getByText } = renderButton();
    fireEvent.press(getByText('Emergency Help'));
    expect(mockOnPress).toHaveBeenCalled();
  });
});
