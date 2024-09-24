import { render, screen, waitFor } from '@testing-library/react';
import App from './App'; // Adjust the path if necessary

test('renders data from API', async () => {
  // Render the component within the test
  render(<App />);

  // Assuming your component displays a loading state first,
  // we wait for the element to appear in the document.
  const linkElement = await waitFor(() => screen.getByText(/Add New Document/i));
  
  // Expect the link to be present in the document
  expect(linkElement).toBeInTheDocument();
});
