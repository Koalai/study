const listHelper = require("../utils/list_helper")

test("dummy returns one", () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe("total likes", () => {
  test("of empty list is zero", () => {
    const blogs = []
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
  })
  test("when list has only one blog equals the likes of that", () => {
    const blogs = [
      {
        title: "Khoa",
        likes: 20,
      },
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(20)
  })
  test("of a bigger list is calculated right", () => {
    const blogs = [
      {
        title: "Khoa",
        likes: 200,
      },
      {
        title: "An",
        likes: 1,
      },
    ]
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(201)
  })
})

describe("favorite blog", () => {
  test("of empty list is zero", () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual([])
  })
  test("when list has only one blog equals the likes of that", () => {
    const blogs = [
      {
        title: "Khoa",
        likes: 20,
      },
    ]
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({ likes: 20, title: "Khoa" })
  })
  test("of a bigger list is calculated right", () => {
    const blogs = [
      {
        title: "Khoa",
        likes: 200,
      },
      {
        title: "An",
        likes: 1,
      },
      {
        title: "Nguyen",
        likes: 201,
      },
    ]
    const result = listHelper.favoriteBlog(blogs)
    console.log(result)
    expect(result).toEqual({ title: "Nguyen", likes: 201 })
  })
})

describe("most blogs", () => {
  test("of empty list is zero", () => {
    const blogs = []
    const result = listHelper.mostLikesBlog(blogs)
    expect(result).toEqual({})
  })
  test("when list has only one blog equals the likes of that", () => {
    const blogs = [{ title: "Blog 1", author: "Alice", likes: 14 }]
    const result = listHelper.mostLikesBlog(blogs)
    expect(result).toEqual({ likes: 14, author: "Alice" })
  })
  test("of a bigger list is calculated right", () => {
    const blogs = [
      { title: "Blog 1", author: "Alice", likes: 5 },
      { title: "Blog 2", author: "Bob", likes: 10 },
      { title: "Blog 3", author: "Alice", likes: 15 },
      { title: "Blog 4", author: "Charlie", likes: 7 },
      { title: "Blog 5", author: "Alice", likes: 3 },
    ]
    const result = listHelper.mostLikesBlog(blogs)
    expect(result).toEqual({
      author: "Alice",
      likes: 23
    })
  })
})
