const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require('jsonwebtoken')




blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user',  { username: 1, name: 1 })
    response.json(blogs)
  } catch (error) {
    console.log(error)
    response.status(500).json({ error: "Internal server error" })
  }
})

blogsRouter.post("/", async (request, response) => {
  const blogData = request.body

  if (!request.token) {
    return response.status(401).json({ error: 'token must be provided' });
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!blogData.title || !blogData.url) {
    return response.status(400).json({ error: "Title and URL are required." });}

  const blog = new Blog({
    ...blogData,
    likes: blogData.likes || 0,
    user: user.id
  })


  try {
    const result = await blog.save();
    console.log(result)
    response.status(201).json({
     ...result
    });
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: "Bad request" });
  }
})

blogsRouter.delete("/:id", async (request, response) => {
  const { id } = request.params;

  // Verify the token and get the user ID
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found." });
    }

    // Check if the user ID from the token matches the blog creator's ID
    if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(403).json({ error: 'Unauthorized: You cannot delete this blog.' });
    }

    await Blog.findByIdAndDelete(id);
    response.status(204).end(); 
  } catch (error) {
    console.log(error);
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
