import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

//Test som verfierar att email och password fältet visas
test('renders login form', () => {
    render(<Login setIsAuthenticated={() => {}} />);
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
});

// Test Hittar inmatningsfälten för e-post och lösenord och matar in data i fälten
test('handles username and password input', () => {
    render(<Login setIsAuthenticated={() => {}} />);
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);

    fireEvent.change(emailInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
});

// Test som verifirer att det går att klicka på login knappen
test('submits the form', () => {
    const mockSetIsAuthenticated = jest.fn();
    render(<Login setIsAuthenticated={mockSetIsAuthenticated} />);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.click(submitButton);

    expect(submitButton).toBeInTheDocument();
});
