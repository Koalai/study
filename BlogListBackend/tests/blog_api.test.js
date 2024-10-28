const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const app = require("../app");
const config = require("../utils/config");

const api = supertest(app);


beforeAll(async () => {
  await mongoose.connect(config.MONGODB_URI);
});


afterAll(async () => {
  await mongoose.connection.close();
});


afterEach(async () => {
  await Blog.deleteMany({});
});


describe("blog api test", () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtlbWtpdWtpdTE0MTIiLCJpZCI6IjY3MWM1ZWQ0MzY3ZTVhNzI0MzAyOWYyOCIsImlhdCI6MTczMDEwNTgyMSwiZXhwIjoxNzMwMTA5NDIxfQ.FOh6mJJFUKFrfdaQeWtS6aF6qLZzOLNfY8ZIw_MbmN0';

  test("blogs are returned as json", async () => {
    const response = await api.get("/api/blogs");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/application\/json/);
  });

  test("correct number of blogs is returned", async () => {
    const response = await api.get("/api/blogs");

    const blogsInDb = await Blog.find({});

    expect(response.body.length).toBe(blogsInDb.length);
  });

  test('blogs have a unique identifier property named "_id"', async () => {
    const response = await api.get("/api/blogs");

    const blogs = response.body;

    blogs.forEach((blog) => {
      expect(blog).toHaveProperty("_id");
      expect(blog).not.toHaveProperty("id");
    });
  });

  test("POST /api/blogs creates a new blog post successfully", async () => {
    const newBlog = {
      title: "Test Blog - Path to challengers LOL",
      author: "Khoa",
      url: "https://examples.com",
      likes: 30,
    };

    const initialBlogs = await Blog.find({});

    const response = await api
      .post("/api/blogs")
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);

    const updateBlogs = await Blog.find({});
    expect(updateBlogs.length).toBe(initialBlogs.length + 1);

    const savedBlog = await Blog.findById(response.body._id);
    expect(savedBlog).toBeTruthy();
    expect(savedBlog.title).toBe(newBlog.title);
    expect(savedBlog.author).toBe(newBlog.author);
    expect(savedBlog.likes).toBe(newBlog.likes);
  });

  test("POST /api/blogs creates a new blog post with default likes", async () => {
    const newBlog = {
      title: "Test Blog - Amazing Journey",
      author: "Khoa",
      url: "https://examples.com",
    };

    const response = await api
      .post("/api/blogs")
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog);

    const savedBlog = await Blog.findById(response.body._id);
    expect(savedBlog).toBeTruthy();
    expect(savedBlog.likes).toBe(0);
  });

  test('POST /api/blogs returns 400 if title is missing', async () => {
    const newBlog = {
      author: 'Khoa',
      url: 'https://examples.com',
      likes: 10,
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
      
    expect(response.body.error).toBe("Title and URL are required.");
  });

  test('POST /api/blogs returns 400 if url is missing', async () => {
    const newBlog = {
      title: 'Valid Title',
      author: 'Khoa',
      likes: 10,
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
      
    expect(response.body.error).toBe("Title and URL are required.");
  });

  test('POST /api/blogs returns 400 if both title and url are missing', async () => {
    const newBlog = {
      author: 'Khoa',
      likes: 10,
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400);
      
    expect(response.body.error).toBe("Title and URL are required.");
  });

  test('DELETE /api/blogs/:id removes a blog post', async () => {
    const newBlog = {
      title: 'Blog to Delete',
      author: 'Khoa',
      url: 'https://examples.com/delete',
    };

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);
      
    const blogId = postResponse.body._id;

    await api.delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const deletedBlog = await Blog.findById(blogId);
    expect(deletedBlog).toBeNull();
  });

  test('DELETE /api/blogs/:id returns 404 for non-existent blog', async () => {
    const nonExistentId = '60c72b2f9b1d8e0b8f8e4f0e';

    const response = await api
      .delete(`/api/blogs/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);
      
    expect(response.body.error).toBe("Blog not found.");
  });

  test('PUT /api/blogs/:id updates the likes of a blog post', async () => {
    const newBlog = {
      title: 'Blog to Update',
      author: 'Khoa',
      url: 'https://examples.com/update',
      likes: 5,
    };

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201);
      
    const blogId = postResponse.body._id;

    const updateResponse = await api
      .put(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 10 })
      .expect(200);

    expect(updateResponse.body.likes).toBe(10);
    expect(updateResponse.body.title).toBe(newBlog.title);
    expect(updateResponse.body.author).toBe(newBlog.author);
  });

  test('PUT /api/blogs/:id returns 404 for non-existent blog', async () => {
    const nonExistentId = '60c72b2f9b1d8e0b8f8e4f0e';

    const response = await api
      .put(`/api/blogs/${nonExistentId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ likes: 10 })
      .expect(404);
      
    expect(response.body.error).toBe("Blog not found.");
  });
});
