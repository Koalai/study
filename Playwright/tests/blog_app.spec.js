const { test, expect, describe, beforeEach } = require('@playwright/test');
const { loginWith, createBlog } = require('./helper');

describe('blog app', () => {
  const testUser = {
    username: 'testingUser',
    password: 'testinguser',
  };
  const testBlog = {
    title: 'Testing',
    author: 'Khoa',
    url: 'examples.com',
  };

  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', { data: testUser });
    await request.post('/api/login', {
      data: { username: testUser.username, password: testUser.password },
    });
    await page.goto('/');
  });
  test('Login form is shown', async ({ page }) => {
    const loginText = await page.getByText('log in to application');
    await expect(loginText).toBeVisible();
  });
  describe('when logged in', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password);
      const blogText = await page.getByText('blogs');
      await expect(blogText).toBeVisible();
    });
    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, testUser.username, 'dsaweqwq');

      const errorMessage = await page.getByText('Wrong username or password');
      await expect(errorMessage).toBeVisible();
    });
    test('a new blog can be created', async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password);
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url);
      const blog = page.getByText('Testing Khoa');
      await expect(blog).toBeVisible();
    });
    test('a blog can be liked', async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password);
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url);
      const showButton = await page.getByText('Show');
      await expect(showButton).toBeVisible();
      await showButton.click();

      const likeCount = await page.getByText('Likes:');
      await expect(likeCount).toBeVisible();
    });

    test('a blog can be deleted by its creator', async ({ page, request }) => {
      await loginWith(page, testUser.username, testUser.password);
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url);
      const showButton = await page.getByText('Show');
      showButton.click();
      const deleteButton = await page.getByText('Delete');
      await deleteButton.click();

      const response = await request.get('/api/blogs');
      const blogs = await response.json();

      const createdBlog = blogs.find(
        (blog) =>
          blog.title === testBlog.title &&
          blog.author === testBlog.author &&
          blog.url === testBlog.url
      );

      expect(createdBlog).toBeDefined();

      const blogId = createdBlog._id;
      console.log(blogId);

      page.on('dialog', async (dialog) => await dialog.accept());
      await request.delete(`/api/blogs/${blogId}`);

      const newResponse = await request.get('/api/blogs');
      const newBlogs = await newResponse.json();

      const deletedBlog = newBlogs.find((blog) => blog.id === blogId);
      expect(deletedBlog).toBeUndefined();
    });
    test.only('only the user who added the blog sees the delete button', async ({
      page,
      request,
    }) => {
     
      const secondUser = {
        username: 'secondUser',
        password: 'seconduser',
      };
      await loginWith(page, testUser.username, testUser.password);
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url); 

    
      const showButton = await page.getByText('Show');
      await showButton.click();
      const deleteButton = page.getByText('Delete');
      expect(deleteButton).toBeVisible();

      await page.getByText('Log out').click(); 
      
      await page.goto('/');
      await request.post('/api/users', { data: secondUser });
      await request.post('/api/login', {
        data: { username: secondUser.username, password: secondUser.password },
      });
      await loginWith(page, secondUser.username, secondUser.password);

      const blogTitle = await page.getByText(testBlog.title);
      await expect(blogTitle).toBeVisible();

      await showButton.click();
      const deleteButtonForSecondUser = await page.getByText('Delete');
      await expect(deleteButtonForSecondUser).not.toBeVisible();
    });
  });
});
