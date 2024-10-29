import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';

// Test som verifierar att email och password-fältet visas
test('renders register form', () => {
    render(<Register />);
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
});

// Test som hittar inmatningsfälten för e-post och lösenord och matar in data i fälten
test('handles email and password input', () => {
    render(<Register />);
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);

    // Simulera att användaren skriver in e-post och lösenord
    fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Verifiera att fältens värden har uppdaterats
    expect(emailInput.value).toBe('testuser@example.com');
    expect(passwordInput.value).toBe('password123');
});

// Test som verifierar att det går att klicka på register-knappen
test('submits the form', () => {
    render(<Register />);
    const submitButton = screen.getByRole('button', { name: /register/i });

    // Simulera klick på register-knappen
    fireEvent.click(submitButton);

    // Kontrollera att knappen finns och går att klicka på
    expect(submitButton).toBeInTheDocument();
});
