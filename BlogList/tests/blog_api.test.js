const { test, afterEach, beforeEach, describe } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const Blog = require("../models/blog")
const app = require("../app")
const config = require("../utils/config")

const api = supertest(app)

beforeEach(async () => {
  await mongoose.connect(config.MONGODB_URI)
})

afterEach(async () => {
  await Blog.deleteMany({ author: /Khoa/ })
  await mongoose.connection.close()
})

describe("blog api test", () => {
  test.only("blogs are returned as json", async () => {
    const response = await api.get("/api/blogs")

    assert.strictEqual(response.status, 200)
    assert.match(response.headers["content-type"], /application\/json/)
  })

  test.only("correct number of blogs is returned", async () => {
    const response = await api.get("/api/blogs")

    const blogsInDb = await Blog.find({})

    assert.strictEqual(response.body.length, blogsInDb.length)
  })

  test.only('blogs have a unique identifier property named "id"', async () => {
    const response = await api.get("/api/blogs")

    const blogs = response.body

    blogs.forEach((blog) => {
      assert.ok(blog.hasOwnProperty("id"), 'Blog should have an "id" property')
      assert.ok(
        !blog.hasOwnProperty("_id"),
        'Blog should not have an "_id" property'
      )
    })
  })

  test.only("POST /api/post create a new blog post successfully", async () => {
    const initialBlogs = await Blog.find({})

    const newBlog = {
      title: "Test Blog - Path to challengers LOL",
      author: "Khoa",
      url: "https://examples.com",
      likes: 30,
    }

    const response = await api.post("/api/blogs").send(newBlog).expect(201)

    const updateBlogs = await Blog.find({})
    assert.strictEqual(updateBlogs.length, initialBlogs.length + 1)

    const savedBlog = await Blog.findById(response.body.id)
    assert.ok(savedBlog)
    assert.strictEqual(savedBlog.title, newBlog.title)
    assert.strictEqual(savedBlog.author, newBlog.author)
    assert.strictEqual(savedBlog.likes, newBlog.likes)
  })

  test.only("POST /api/post create a new blog post successfully", async () => {

    const newBlog = {
      title: "Test Blog - Amazing Journey",
      author: "Khoa",
      url: "https://examples.com",
    }

    const response = await api.post("/api/blogs").send(newBlog).expect(201)

    const savedBlog = await Blog.findById(response.body.id)
    assert.ok(savedBlog)
    assert.strictEqual(savedBlog.likes, 0)
  })

  test('POST /api/blogs returns 400 if title is missing', async () => {
    const newBlog = {
      author: 'Khoa',
      url: 'https://examples.com',
      likes: 10,
    };
  
    const response = await api.post('/api/blogs').send(newBlog).expect(400);
    assert.strictEqual(response.body.error, "Title and URL are required.");
  });
  
  test('POST /api/blogs returns 400 if url is missing', async () => {
    const newBlog = {
      title: 'Valid Title',
      author: 'Khoa',
      likes: 10,
    };
  
    const response = await api.post('/api/blogs').send(newBlog).expect(400);
    assert.strictEqual(response.body.error, "Title and URL are required.");
  });
  
  test('POST /api/blogs returns 400 if both title and url are missing', async () => {
    const newBlog = {
      author: 'Khoa',
      likes: 10,
    };
  
    const response = await api.post('/api/blogs').send(newBlog).expect(400);
    assert.strictEqual(response.body.error, "Title and URL are required.");
  });

  test('DELETE /api/blogs/:id removes a blog post', async () => {
    const newBlog = {
      title: 'Blog to Delete',
      author: 'Khoa',
      url: 'https://examples.com/delete',
    };
  
    const postResponse = await api.post('/api/blogs').send(newBlog).expect(201);
    const blogId = postResponse.body.id;
  
    const deleteResponse = await api.delete(`/api/blogs/${blogId}`);
  
    const deletedBlog = await Blog.findById(blogId);
    assert.strictEqual(deletedBlog, null); 
  });
  
  test('DELETE /api/blogs/:id returns 404 for non-existent blog', async () => {
    const nonExistentId = '60c72b2f9b1d8e0b8f8e4f0e'; 
  
    const response = await api.delete(`/api/blogs/${nonExistentId}`).expect(404);
    assert.strictEqual(response.body.error, "Blog not found.");
  });

  test('PUT /api/blogs/:id updates the likes of a blog post', async () => {
   
    const newBlog = {
      title: 'Blog to Update',
      author: 'Khoa',
      url: 'https://examples.com/update',
      likes: 5,
    };
  
    const postResponse = await api.post('/api/blogs').send(newBlog).expect(201);
    const blogId = postResponse.body.id;
  
 
    const updateResponse = await api.put(`/api/blogs/${blogId}`).send({ likes: 10 }).expect(200);
  
    
    assert.strictEqual(updateResponse.body.likes, 10);
    assert.strictEqual(updateResponse.body.title, newBlog.title);
    assert.strictEqual(updateResponse.body.author, newBlog.author);
  });
  
  test('PUT /api/blogs/:id returns 404 for non-existent blog', async () => {
    const nonExistentId = '60c72b2f9b1d8e0b8f8e4f0e'; 
  
    const response = await api.put(`/api/blogs/${nonExistentId}`).send({ likes: 10 }).expect(404);
    assert.strictEqual(response.body.error, "Blog not found.");
  });
})
