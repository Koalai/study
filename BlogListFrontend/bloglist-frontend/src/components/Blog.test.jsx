
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
  const user = userEvent.setup()

  it('renders the blog title and author but does not render URL or likes by default', () => {
    render(<Blog blogs={mockBlogs} setBlogs={mockSetBlogs} />);

  
    expect(screen.getByText('Test Blog Title Test Author')).toBeInTheDocument();

   
    expect(screen.queryByText('URL:')).not.toBeInTheDocument();
    expect(screen.queryByText('Likes:')).not.toBeInTheDocument();
  });


  it('shows URL and number of likes when the show button is clicked', async () => {
    render(<Blog blogs={mockBlogs} setBlogs={mockSetBlogs} />);

   
    await user.click(screen.getByRole('button', { name: /show/i }));

  
    expect(screen.getByText('URL: https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Likes: 5')).toBeInTheDocument();
  });

  it('calls the setBlogs handler twice when the like button is clicked twice', async () => {
    render(<Blog blogs={mockBlogs} setBlogs={mockSetBlogs} />);
    
    await user.click(screen.getByRole('button', { name: /show/i }));
    const likeButton = screen.getByRole('button', { name: /like/i });
  
    await  user.click(likeButton); 
    await  user.click(likeButton);
  
    screen.debug()

    expect(mockSetBlogs.mock.calls).toHaveBeenCalledTimes(2)
    console.log("setBlogs calls:", mockSetBlogs.mock.calls);
  });
  
});
