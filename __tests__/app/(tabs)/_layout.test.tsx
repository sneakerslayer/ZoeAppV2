
import { render } from '@testing-library/react-native';
import TabLayout from '@/app/(tabs)/_layout';
import { ThemeProvider } from '@/context/ThemeContext';

jest.mock('expo-router', () => ({
  Tabs: () => null,
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('TabLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <ThemeProvider>
        <TabLayout />
      </ThemeProvider>
    );
    expect(container).toBeTruthy();
  });

  it('contains correct tab screens', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TabLayout />
      </ThemeProvider>
    );
    expect(getByTestId('tab-layout')).toBeTruthy();
  });
});
