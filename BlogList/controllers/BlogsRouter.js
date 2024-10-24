const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")

blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    

    const formattedBlogs = blogs.map((blog) => ({
      id: blog._id.toString(),
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes
    }));


    response.json(formattedBlogs)
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: "Internal server error" })
  }
})

blogsRouter.post("/", async (request, response) => {
  const blogData = request.body

  const user = await User.findById(blogData.userId)

  if (!blogData.title || !blogData.url) {
    return response.status(400).json({ error: "Title and URL are required." });}

  const blog = new Blog({
    ...blogData,
    likes: blogData.likes || 0,
    user: user.id
  })

  try {
    const result = await blog.save()
    user.blogs = user.blogs.concat(result._id)
    await user.save()

    const { _id, ...rest } = result

    response.status(201).json({
      id: _id.toString(),
      ...rest,
    })
  } catch (error) {
    response.status(400).json({ error: "Bad request" })
  }
})

blogsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return response.status(404).json({ error: "Blog not found." });
    }
    response.status(204).end(); 
  } catch (error) {
    response.status(400).json({ error: "Bad request" });
  }
});

blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { likes } = request.body; 

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: "Blog not found." });
    }

    response.json({
      id: updatedBlog._id.toString(),
      title: updatedBlog.title,
      author: updatedBlog.author,
      url: updatedBlog.url,
      likes: updatedBlog.likes,
    });
  } catch (error) {
    response.status(400).json({ error: "Bad request" });
  }
});

module.exports = blogsRouter
