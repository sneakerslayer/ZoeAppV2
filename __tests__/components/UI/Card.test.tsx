
import { render, fireEvent } from '@testing-library/react-native';
import Card from '@/components/UI/Container';
import { ThemeProvider } from '@/context/ThemeContext';

describe('Card', () => {
  const mockOnPress = jest.fn();

  const renderCard = (props = {}) => {
    return render(
      <ThemeProvider>
        <Card {...props}>
          <Text>Test Content</Text>
        </Card>
      </ThemeProvider>
    );
  };

  it('renders children correctly', () => {
    const { getByText } = renderCard();
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('handles onPress events', () => {
    const { getByText } = renderCard({ onPress: mockOnPress });
    fireEvent.press(getByText('Test Content'));
    expect(mockOnPress).toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const customStyle = { margin: 20 };
    const { getByTestId } = renderCard({ style: customStyle });
    const card = getByTestId('card');
    expect(card.props.style).toMatchObject(expect.arrayContaining([
      expect.objectContaining(customStyle)
    ]));
  });
});
