import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Importera BrowserRouter
import App from './App'; // Justera sökvägen om det behövs

test('renders data from API', async () => {
  // Lägg till BrowserRouter runt App-komponenten
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Vi väntar på att "Add New Document"-texten ska visas
  const linkElement = await waitFor(() => screen.getByText(/Add New Document/i));

  // Förväntar oss att länken ska vara i dokumentet
  expect(linkElement).toBeInTheDocument();
});
