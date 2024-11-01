import PropTypes from "prop-types"; 

function BlogForm({
  createBlog,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  handleCancel,
}) {

  const handleSubmit = (event) => {
    event.preventDefault();
    createBlog({ title, author, url });
   }

  return (
    <div>
      <h2 className='font-bold text-4xl'>Create new</h2>
      <form className='flex flex-col w-52' onSubmit={handleSubmit}>
        <label htmlFor='title'>Title</label>
        <input
          id='title'
          data-testid='title'
          type='text'
          className='border'
          value={title}
          onChange={handleTitleChange}
        />
        <label htmlFor='author'>Author</label>
        <input
          id='author'
          data-testid='author'
          type='text'
          className='border'
          value={author}
          onChange={handleAuthorChange}
        />
        <label htmlFor='url'>URL</label>
        <input
          id='url'
          data-testid='url'
          type='text'
          className='border'
          value={url}
          onChange={handleUrlChange}
        />
        <div className='flex'>
          <button
            className='bg-slate-400 px-2 py-1 text-white rounded-md mx-auto my-4'
            type='submit'
          >
            Create
          </button>
          <button
            type='button'
            className='bg-slate-400 px-2 py-1 text-white rounded-md mx-auto my-4'
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  handleUrlChange: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

export default BlogForm;
