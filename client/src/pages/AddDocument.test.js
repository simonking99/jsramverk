import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import AddDocument from './AddDocument';

// Mocka axios för att skapa dokument
jest.mock('axios');
global.fetch = jest.fn();

// Definiera API-URL:en som en konstant
const API_URL = 'https://jsramverk-v2x-ane2cxfnc8dddcgf.swedencentral-01.azurewebsites.net';

test('skapar ett dokument och verifierar dess existens via GraphQL fetch', async () => {
    const onAddDocument = jest.fn();
    const newDocument = { id: 1, title: 'Test Title', content: 'Test Content' };

    // Mocka POST-anrop för att skapa ett dokument
    axios.post.mockResolvedValue({ data: newDocument });

    // Mocka fetch-svar för att simulera att GraphQL API returnerar det skapade dokumentet
    fetch.mockResolvedValueOnce({
        json: async () => ({
            data: { documents: [newDocument] }
        })
    });

    // Rendera AddDocument-komponenten
    render(
        <MemoryRouter>
            <AddDocument onAddDocument={onAddDocument} />
        </MemoryRouter>
    );

    // Fyller i formuläret
    fireEvent.change(screen.getByPlaceholderText('Rubrik'), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByPlaceholderText('Innehåll'), { target: { value: 'Test Content' } });

    // Klicka på Lägg till dokument knappen
    fireEvent.click(screen.getByText('Lägg till dokument'));

    // Vänta på formulärinskickning
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
            `${API_URL}/addone`,  // Använd API_URL-variabeln här
            { title: 'Test Title', content: 'Test Content' },
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: expect.stringContaining('Bearer'),
                }),
            })
        );
        expect(onAddDocument).toHaveBeenCalled();
    });

    // Hämta alla dokument med GraphQL-fråga
    const response = await fetch(`${API_URL}/graphql`, {  // Använd API_URL-variabeln här
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query {
                    documents {
                        id
                        title
                        content
                    }
                }
            `
        })
    });
    const result = await response.json();
    const documents = result.data.documents;

    // Kontrollera att det nya dokumentet finns med i listan
    expect(documents).toContainEqual(newDocument);
    console.log(documents);
});
