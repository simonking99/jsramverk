import { render, screen, waitFor } from '@testing-library/react';
import App from './AddDocument'; // Adjust the path if necessary

test('Letar efter text Rubrik', async () => {
  // Render the component within the test
  render(<App />);
  const linkElement = await waitFor(() => screen.getByText(/Rubrik/i));
  // Expect the link to be present in the document
  expect(linkElement).toBeInTheDocument();
});

test('Letar efter text Innehåll', async () => {
    // Render the component within the test
    render(<App />);
    const linkElement = await waitFor(() => screen.getByText(/Innehåll/i));
    // Expect the link to be present in the document
    expect(linkElement).toBeInTheDocument();
  });

  test('Kontrollerar att input-fältet är tomt', async () => {
    render(<App />);
  
    // Hämta input-fältet genom dess label
    const inputElement = screen.getByLabelText(/Rubrik:/i); // Använd den korrekta label-texten
  
    // Kontrollera att värdet är tomt
    expect(inputElement.value).toBe(''); // Förväntar oss att det är tomt
  });