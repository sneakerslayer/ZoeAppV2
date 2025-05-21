
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CrisisAlert } from '@/components/CrisisIntervention/CrisisAlert';
import * as Linking from 'expo-linking';

jest.mock('expo-linking', () => ({
  openURL: jest.fn().mockResolvedValue(true)
}));
const mockOpenURL = jest.spyOn(Linking, 'openURL');

describe('CrisisAlert', () => {
  beforeEach(() => {
    mockOpenURL.mockClear();
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders emergency contact buttons', () => {
    const { getByText } = render(<CrisisAlert />);
    
    expect(getByText(/call emergency services/i)).toBeTruthy();
    expect(getByText(/crisis lifeline/i)).toBeTruthy();
  });

  it('attempts to call emergency number when pressed', async () => {
    const { getByText } = render(<CrisisAlert />);
    
    fireEvent.press(getByText('Call Emergency Services (911)'));
    
    await waitFor(() => {
      expect(mockOpenURL).toHaveBeenCalledWith('tel:911');
    });
  });
});
