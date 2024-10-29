import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Test för att kontrollera att texten "Document Management" finns på sidan
test('renders App component', () => {
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
    expect(screen.getByText(/© 2024 Document Management App/i)).toBeInTheDocument();
});
