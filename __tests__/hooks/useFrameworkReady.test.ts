
import { renderHook } from '@testing-library/react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { Platform } from 'react-native';

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn()
}));

describe('useFrameworkReady', () => {
  it('should set ready state to true on web platform', () => {
    const { result } = renderHook(() => useFrameworkReady());
    expect(result.current).toBe(true);
  });

  it('should handle non-web platforms', () => {
    Platform.OS = 'ios';
    const { result } = renderHook(() => useFrameworkReady());
    expect(result.current).toBe(true);
  });
});
