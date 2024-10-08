import { render, screen, waitFor } from '@testing-library/react';
import App from './App'; // Adjust the path if necessary

test('renders Lägg till nytt dokument', async () => {
  // Render the component within the test
  render(<App />);
  const linkElement = await waitFor(() => screen.getByText(/Lägg till nytt dokument/i));
  // Expect the link to be present in the document
  expect(linkElement).toBeInTheDocument();
});
