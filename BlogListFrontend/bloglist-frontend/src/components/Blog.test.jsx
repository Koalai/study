import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import Blog from "./Blog"
import blogService from "../services/blogs"

vi.mock("../services/blogs", () => ({
  default: {
    update: vi.fn(),
  },
}))

describe("Blog component", () => {
  const mockSetBlogs = vi.fn()
  const mockBlogs = [
    {
      _id: "672069c3785c4032ea48d853",
      title: "Test Blog Title",
      author: "Test Author",
      url: "https://example.com",
      likes: 5,
      user: { name: "Test User" },
    },
  ]
  const user = userEvent.setup()

  it("renders the blog title and author but does not render URL or likes by default", () => {
    render(<Blog blogs={mockBlogs} setBlogs={mockSetBlogs} />)

    expect(screen.getByText("Test Blog Title Test Author")).toBeInTheDocument()

    expect(screen.queryByText("URL:")).not.toBeInTheDocument()
    expect(screen.queryByText("Likes:")).not.toBeInTheDocument()
  })

  it("shows URL and number of likes when the show button is clicked", async () => {
    render(<Blog blogs={mockBlogs} setBlogs={mockSetBlogs} />)

    await user.click(screen.getByRole("button", { name: /show/i }))

    expect(screen.getByText("URL: https://example.com")).toBeInTheDocument()
    expect(screen.getByText("Likes: 5")).toBeInTheDocument()
  })

  it("calls the setBlogs handler twice when the like button is clicked twice", async () => {
    let testBlog = {...mockBlogs[0]}
    vi.spyOn(blogService, "update").mockImplementation(() => {
      testBlog = { ...testBlog, likes: testBlog.likes + 1 }
      return testBlog
    })
    const { getByTestId } = render(
      <Blog blogs={mockBlogs} setBlogs={mockSetBlogs} />
    )

    await user.click(screen.getByRole("button", { name: /show/i }))
    const likeButton = screen.getByRole("button", { name: /like/i })

    expect(getByTestId(`${mockBlogs[0]._id}-likes`).textContent).toEqual(
      `Likes: ${mockBlogs[0].likes}`
    )
    await user.click(likeButton)
    await waitFor(() => {
      expect(mockSetBlogs).toBeCalledTimes(1)
    })
    await user.click(likeButton)
    await waitFor(() => {
      expect(mockSetBlogs).toBeCalledTimes(2)
    })

    expect(mockSetBlogs).toHaveBeenCalledTimes(2)
    console.log("setBlogs calls:", mockSetBlogs.mock.calls)
  })
})
