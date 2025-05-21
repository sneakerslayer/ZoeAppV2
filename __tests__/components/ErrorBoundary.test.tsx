
import React from 'react';
import { render, Text, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '@/components/ErrorBoundary';

describe('ErrorBoundary', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  const ValidComponent = () => (
    <Text testID="test-content">Test Content</Text>
  );

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render error UI when error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText(/something went wrong/i)).toBeTruthy();
    expect(getByText(/try again/i)).toBeTruthy();
  });

  it('should render children when no error occurs', () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <Text testID="test-content">Test Content</Text>
      </ErrorBoundary>
    );

    expect(getByTestId('test-content')).toBeTruthy();
  });

  it('should render error UI when error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(getByText(/something went wrong/i)).toBeTruthy();
  });

  it('should reset error state when try again is pressed', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ValidComponent />
      </ErrorBoundary>
    );

    const instance = React.createRef<ErrorBoundary>();
    instance.current?.setState({ hasError: true, error: new Error('Test') });

    fireEvent.press(getByText(/try again/i));
    expect(instance.current?.state.hasError).toBeFalsy();
  });
});
