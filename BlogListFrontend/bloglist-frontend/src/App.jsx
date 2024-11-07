import { useEffect, useState } from 'react';
import blogService from './services/blogs';
import './index.css';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import { setUser, logOut } from './reducers/userReducer';
import { initializeBlogs } from './reducers/blogReducer';
import UserDetail from './components/UserDetail';
import Users from './components/Users';
import { Route, Routes } from 'react-router-dom';
import Menu from './components/Menu';
import Blogs from './components/Blogs';
import loginService from './services/login';
import BlogDetail from './components/BlogDetail';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  });

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newNote) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(['blogs'], blogs.concat(newNote));
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn:({id, updatedBlog}) =>  blogService.update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
      );
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (deletedBlogId) => {
      const blogs = queryClient.getQueryData(['blogs']);
      const updatedBlog = blogs.filter((blog) => blog._id !== deletedBlogId);
      queryClient.setQueryData(['blogs'], updatedBlog);
      queryClient.invalidateQueries(['blogs']);
    },
  });

  useEffect(() => {
    const getAllUser = async () => {
      const allUsers = await loginService.getUser();
      setUsers(allUsers);
    };
    getAllUser();
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const storedUser = JSON.parse(loggedUserJSON);
      setUser(storedUser);
      blogService.setToken(storedUser.token);
    }
  }, []);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser');
    setUser(null);
    blogService.setToken(null)
  };
  console.log(user)


  if (isLoading) return <div>Loading blogs...</div>;
  if (isError) return <div>Error loading blogs!</div>;

  return (
    <div className='ml-12 my-12 font-mono '>
      <Menu />
      <h1 className='text-4xl font-bold mt-4'>
        {user === null ? `log in to application` : `blogs`}
      </h1>

      <Notification />
      {user === null ? (
        <>
          <LoginForm setUser={setUser} />
        </>
      ) : (
        <>
          <div className='flex gap-4 items-center mb-4'>
            <h2>{user.name} is logged in</h2>
            <button
              className='bg-slate-400 px-2 py-1 text-white rounded-md'
              onClick={handleLogout}
            >
              Log out
            </button>
          </div>
          <Routes>
            <Route
              path='/create'
              element={<BlogForm createBlogMutation={createBlogMutation} />}
            ></Route>
            <Route
              path='/'
              element={
                <Blogs
                  blogs={blogs}
                  user={user}
                  updateBlogMutation={updateBlogMutation}
                  deleteBlogMutation={deleteBlogMutation}
                />
              }
            ></Route>
            <Route path='/users' element={<Users users={users} />}></Route>
            <Route
              path='/users/:id'
              element={<UserDetail users={users} />}
            ></Route>
            <Route
              path='/blogs/:id'
              element={<BlogDetail blogs={blogs} />}
            ></Route>
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
