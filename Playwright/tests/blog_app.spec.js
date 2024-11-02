const { test, expect, describe, beforeEach } = require("@playwright/test")
const { loginWith, createBlog } = require("./helper")
const exp = require("constants")

describe("blog app", () => {
  const testUser = {
    username: "testingUser",
    password: "testinguser",
    name: "testing1",
  }
  const testBlog = {
    title: "Testing",
    author: "Khoa",
    url: "examples.com",
  }

  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset")
    await request.post("/api/users", { data: testUser })
    await request.post("/api/login", {
      data: { username: testUser.username, password: testUser.password },
    })
    await page.goto("/")
  })
  test("Login form is shown", async ({ page }) => {
    const loginText = await page.getByText("log in to application")
    await expect(loginText).toBeVisible()
  })
  describe("when logged in", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password)
      const blogText = await page.getByText("blogs")
      await expect(blogText).toBeVisible()
    })
    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, testUser.username, "dsaweqwq")

      const errorMessage = await page.getByText("Wrong username or password")
      await expect(errorMessage).toBeVisible()
    })
    test("a new blog can be created", async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password)
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url)
      const blog = page.getByText("Testing Khoa")
      await expect(blog).toBeVisible()
    })
    test("a blog can be liked", async ({ page }) => {
      await loginWith(page, testUser.username, testUser.password)
      await createBlog(page, testBlog.title, testBlog.author, testBloReferenceError: g.url)
      const showButton = await page.getByText("Show")
      await expect(showButton).toBeVisible()
      await showButton.click()

      const likeCount = await page.getByText("Likes:")
      await expect(likeCount).toBeVisible()
    })

    test("a blog can be deleted by its creator", async ({ page, request }) => {
      await loginWith(page, testUser.username, testUser.password)
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url)
      const showButton = await page.getByText("Show")
      showButton.click()
      const deleteButton = await page.getByText("Delete")
      await deleteButton.click()

      const response = await request.get("/api/blogs")
      const blogs = await response.json()

      const createdBlog = blogs.find(
        (blog) =>
          blog.title === testBlog.title &&
          blog.author === testBlog.author &&
          blog.url === testBlog.url
      )

      expect(createdBlog).toBeDefined()

      const blogId = createdBlog._id
      console.log(blogId)

      page.on("dialog", async (dialog) => await dialog.accept())
      await request.delete(`/api/blogs/${blogId}`)

      const newResponse = await request.get("/api/blogs")
      const newBlogs = await newResponse.json()

      const deletedBlog = newBlogs.find((blog) => blog.id === blogId)
      expect(deletedBlog).toBeUndefined()
    })
    test("only the user who added the blog sees the delete button", async ({
      page,
      request,
    }) => {
      const secondUser = {
        username: "secondUser",
        password: "seconduser",
        name: "testing2",
      }ReferenceError: 

      await loginWith(page, testUser.username, testUser.password)
      await createBlog(page, testBlog.title, testBlog.author, testBlog.url)

      const allBlog = await page.getByText("Testing Khoa")
      await expect(allBlog).toBeVisible()

      const logoutBtn = await page.getByRole("button", { name: "Log out" })
      logoutBtn.click()

      await request.post("/api/users", { data: secondUser })
      await request.post("/api/login", {
        data: { username: secondUser.username, password: secondUser.password },
      })
      await loginWith(page, secondUser.username, secondUser.password)

      const blog = await page.getByText("blog")
      await expect(blog).toBeVisible()

      const showButton = await page.getByText("Show")
      await showButton.click()
      const deleteButtonForSecondUser = await page.getByText("Delete")
      await expect(deleteButtonForSecondUser).not.toBeVisible()
    })
    test("blogs are arranged in the order according to the likes", async ({
      page,
      request,
    }) => {
      const blogs = [
        {
          title: "Blog1",
          author: "Khoa",
          url: "examples.com",
          likes: 0,
        },
        {
          title: "Blog2",
          author: "Khoa",
          url: "examples2.com",
          likes: 1,
        },
        {
          title: "Blog3",
          author: "Khoa",
          url: "examples3.com",
          likes: 2,
        },
      ]

      await loginWith(page, testUser.username, testUser.password)

      for (const blog of blogs) {
        await createBlog(page, blog.title, blog.author, blog.url)
        await expect(
          page.getByText(`${blog.title} ${blog.author}`)
        ).toBeVisible()
      }

      const response = await request.get("/api/blogs")
      const blogData = await response.json()
      // console.log(blogData)

      await page.getByTestId(`${blogData[1]._id}-showBtn`).click()
      await page.getByTestId(`${blogData[1]._id}-likes`).click()
      await expect(page.getByTestId(`${blogData[1]._id}-likes`)).toContainText(
        `Likes: 1`
      )

      await page.getByTestId(`${blogData[2]._id}-showBtn`).click()
      await page.getByTestId(`${blogData[2]._id}-likes`).click();
      await expect(page.getByTestId(`${blogData[2]._id}-likes`)).toContainText(
        `Likes: 1`
      )

      await page.getByTestId(`${blogData[2]._id}-likes`).click()
      await expect(page.getByTestId(`${blogData[2]._id}-likes`)).toContainText(
        `Likes: 2`
      )

      await page.getByTestId(`${blogData[2]._id}-likes`).click()
      await expect(page.getByTestId(`${blogData[2]._id}-likes`)).toContainText(
        `Likes: 3`
      )

      const box1 = await page.getByText("Blog1 Khoa").boundingBox()
      const box2 = await page.getByText("Blog2 Khoa").boundingBox()
      const box3 = await page.getByText("Blog3 Khoa").boundingBox()

       expect(box1.y).toBeGreaterThan(box2.y)
       expect(box2.y).toBeGreaterThan(box3.y)
    })
  })
})
