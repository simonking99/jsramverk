import { render, screen, waitFor } from '@testing-library/react';
import App from './Headers'; // Adjust the path if necessary

test('renders Document Manager', async () => {
  // Render the component within the test
  render(<App />);
  const linkElement = await waitFor(() => screen.getByText(/Document Management/i));
  // Expect the link to be present in the document
  expect(linkElement).toBeInTheDocument();
});
