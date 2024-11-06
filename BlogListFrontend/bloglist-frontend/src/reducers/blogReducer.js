import { createSlice } from "@reduxjs/toolkit"
import blogService from '..//services/blogs'


const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    setBlogs: (state, action) => action.payload,
    createBlog: (state, action) => {
      state.push(action.payload)
    },
    updateBlog: (state, action) => {
      return state.map((blog) =>
        blog._id === action.payload._id ? { ...blog, ...action.payload } : blog
      )
    },
    deleteBlog: (state, action) => {
      return state.filter((blog) => blog._id !== action.payload)
    },
  },
})

export const { setBlogs, createBlog, updateBlog, deleteBlog } =
  blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const addNewBlog = (newBlog) => {
  return async dispatch => {
    const response = await blogService.create(newBlog)
    dispatch(createBlog(response))
  }
}

export const updateLike = (updatedBlog) => {
  return async dispatch => {
    const response = await blogService.update(updatedBlog._id, updatedBlog)
    console.log(updatedBlog)
    console.log(response)
    dispatch(updateBlog(response))
  }
}

export const removeBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(deleteBlog(id))
  }
}

export default blogSlice.reducer
