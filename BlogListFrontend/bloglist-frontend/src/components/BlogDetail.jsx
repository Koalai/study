import React from 'react'
import { useParams } from 'react-router-dom'

function BlogDetail({blogs}) {
    const { id } = useParams()
    console.log(id)
    const blog = blogs.find(blog => blog._id === id)

    if (!blog) {
        return <p>Blog not found.</p>
    }

    return (
        <div>{blog && (
            <>
                <h1 className='font-black text-4xl'>{blog.title}</h1>
                <p className='text-2xl font-bold'>{blog.url}</p>
                <p className='font-mono text-3xl'>{blog.author}</p>
                <button>Likes: {blog.likes}</button>
            </>
        ) }</div>
  )
}

export default BlogDetail