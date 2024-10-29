import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentList from './DocumentList';

// Mocka `localStorage` för att returnera ett `userId` och `token`
beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: {
            getItem: jest.fn((key) => {
                if (key === 'userId') return 'mockUserId';
                if (key === 'token') return 'mockToken';
                return null;
            }),
        },
        writable: true,
    });
});

test('calls onAddDocument when "Add new document" button is clicked', () => {
    // Skapa en mock-funktion för onAddDocument
    const onAddDocument = jest.fn();

    // Rendera DocumentList-komponenten med mock-funktionerna
    render(<DocumentList onUpdate={() => {}} onAddDocument={onAddDocument} />);

    // Hitta och klicka på "Add new document"-knappen
    const addButton = screen.getByText(/add new document/i);
    fireEvent.click(addButton);

    // Verifiera att onAddDocument anropades
    expect(onAddDocument).toHaveBeenCalled();
});