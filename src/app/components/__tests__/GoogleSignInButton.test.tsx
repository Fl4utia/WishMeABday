/**
 * Unit tests for GoogleSignInButton component
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GoogleSignInButton from '../GoogleSignInButton';
import { signInWithGoogle } from '@/lib/utils/auth';

// Mock dependencies
jest.mock('@/lib/utils/auth');
jest.mock('next/navigation');
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('GoogleSignInButton', () => {
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (require('next/navigation').useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
  });

  it('should render the button', () => {
    const { getByText, getByAltText } = render(<GoogleSignInButton />);

    expect(getByText('Sign in with Google')).toBeInTheDocument();
    expect(getByAltText('Google')).toBeInTheDocument();
  });

  it('should have correct role attribute', () => {
    const { getByRole } = render(<GoogleSignInButton />);

    const button = getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
