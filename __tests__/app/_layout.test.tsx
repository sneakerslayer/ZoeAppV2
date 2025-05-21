
import { render } from '@testing-library/react-native';
import RootLayout from '@/app/_layout';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

jest.mock('expo-router', () => ({
  Stack: () => null
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn()
}));

jest.mock('expo-font', () => ({
  useFonts: jest.fn()
}));

describe('RootLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle font loading correctly', () => {
    (useFonts as jest.Mock).mockReturnValue([true, null]);
    render(<RootLayout />);
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });

  it('should handle font loading error', () => {
    (useFonts as jest.Mock).mockReturnValue([false, new Error('Font loading failed')]);
    render(<RootLayout />);
    expect(SplashScreen.hideAsync).toHaveBeenCalled();
  });

  it('should return null while fonts are loading', () => {
    (useFonts as jest.Mock).mockReturnValue([false, null]);
    const { container } = render(<RootLayout />);
    expect(container.children.length).toBe(0);
  });
});
