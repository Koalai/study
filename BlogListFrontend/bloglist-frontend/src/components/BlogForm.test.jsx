import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm"; 

describe("BlogForm", () => {
  test("calls createBlog with correct details when a new blog is created", async () => {
    const createBlogMock = vi.fn();
    const handleCancelMock = vi.fn();

    render(
      <BlogForm
        createBlog={createBlogMock}
        title="New Blog Title"
        author="Author Name"
        url="http://example.com"
        handleTitleChange={() => {}}
        handleAuthorChange={() => {}}
        handleUrlChange={() => {}}
        handleCancel={handleCancelMock}
      />
    );

    const user = userEvent.setup();

  
    await user.type(screen.getByLabelText(/title/i), "New Blog Title");
    await user.type(screen.getByLabelText(/author/i), "Author Name");
    await user.type(screen.getByLabelText(/url/i), "http://example.com");

    await user.click(screen.getByRole("button", { name: /create/i }));

  
    expect(createBlogMock).toHaveBeenCalledTimes(1);
   
    expect(createBlogMock).toHaveBeenCalledWith({
      title: "New Blog Title",
      author: "Author Name",
      url: "http://example.com",
    });
  });
});
