
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';


describe('Blog component', () => {
  const mockSetBlogs = vi.fn();
  const mockBlogs = [
    {
      _id: '1',
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 5,
      user: { name: 'Test User' },
    },
  ];

  it('renders the blog title and author but does not render URL or likes by default', () => {
    render(<Blog blogs={mockBlogs} setBlogs={mockSetBlogs} />);

  
    expect(screen.getByText('Test Blog Title Test Author')).toBeInTheDocument();

   
    expect(screen.queryByText('URL:')).not.toBeInTheDocument();
    expect(screen.queryByText('Likes:')).not.toBeInTheDocument();
  });


  it('shows URL and number of likes when the show button is clicked', async () => {
    render(<Blog blogs={mockBlogs} setBlogs={mockSetBlogs} />);

   
    await userEvent.click(screen.getByRole('button', { name: /show/i }));

  
    expect(screen.getByText('URL: https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Likes: 5')).toBeInTheDocument();
  });

  
  
});
