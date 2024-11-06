const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const {userExtractor} = require('../utils/middleware')


// GET all blogs
blogsRouter.get("/", async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    console.log(blogs)
    response.json(blogs);
  } catch (error) {
    console.log(error);
    response.status(500).json({ error: "Internal server error" });
  }
});

// POST a new blog (cần xác thực người dùng)
blogsRouter.post("/", userExtractor, async (request, response) => {
  const blogData = request.body;
  console.log(request)

  if (!blogData.title || !blogData.url) {
    return response.status(400).json({ error: "Title and URL are required." });
  }

  const blog = new Blog({
    ...blogData,
    likes: blogData.likes || 0,
    user: request.user.id
  });


  try {
    const result = await blog.save();
    const userBlogSaved = await User.findById(request.user.id)
    userBlogSaved.blogs = userBlogSaved.blogs.concat(result._id)
    await userBlogSaved.save()  


    response.status(201).json(result);
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: "Bad request" });
  }
});

// DELETE a blog (cần xác thực người dùng)
blogsRouter.delete("/:id", userExtractor, async (request, response) => {
  const { id } = request.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: "Blog not found." });
    }

    // Kiểm tra xem user có quyền xóa blog này
    if (blog.user.toString() !== request.user.id.toString()) {
      return response.status(403).json({ error: 'Unauthorized: You cannot delete this blog.' });
    }

    await Blog.findByIdAndDelete(id);
    response.status(204).end(); 
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: "Bad request" });
  }
});

// PUT (update likes) for a blog
blogsRouter.put("/:id", async (request, response) => {
  const { id } = request.params;
  const { likes } = request.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true, runValidators: true }
    ).populate('user', { name: 1, username: 1 });

    if (!updatedBlog) {
      return response.status(404).json({ error: "Blog not found." });
    }

    response.json({
      _id: updatedBlog._id,
      title: updatedBlog.title,
      author: updatedBlog.author,
      url: updatedBlog.url,
      likes: updatedBlog.likes,
      user: {
        id: updatedBlog.user._id,
        username: updatedBlog.user.username,
        name: updatedBlog.user.name
      }
    });
  } catch (error) {
    console.error(error);
    response.status(400).json({ error: error.message });
  }
});


module.exports = blogsRouter;
