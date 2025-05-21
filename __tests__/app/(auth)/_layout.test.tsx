
import { render } from '@testing-library/react-native';
import AuthLayout from '@/app/(auth)/_layout';
import { Stack } from 'expo-router';

jest.mock('expo-router', () => ({
  Stack: jest.fn(() => null),
}));

describe('AuthLayout', () => {
  it('renders correctly', () => {
    render(<AuthLayout />);
    expect(Stack).toHaveBeenCalled();
  });
});
