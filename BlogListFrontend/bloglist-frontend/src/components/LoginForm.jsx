import { useState } from 'react';
import loginService from '../services/login';
import blogService from '../services/blogs';
import { useNoti } from './NotiProvider';
import { useMutation } from '@tanstack/react-query';

function LoginForm({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setError, clearNoti } = useNoti();

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (user) => {
      blogService.setToken(user.token);
      console.log(user.token);
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
    },
    onError: (exception) => {
      if (exception.response && exception.response.status === 401) {
        setError('Wrong username or password');
      } else {
        setError('Login failed');
      }

      setTimeout(() => {
        clearNoti();
      }, 5000);
    },
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  return (
    <form className={`flex flex-col w-52`} onSubmit={handleLogin}>
      <label htmlFor='username'>Username</label>
      <input
        data-testid='username'
        type='text'
        className='border'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor='password'>Password</label>
      <input
        data-testid='password'
        type='password'
        className='border'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className='bg-slate-400 mx-auto mt-2 text-white px-2 py-1 rounded-md'
        type='submit'
      >
        Login
      </button>
    </form>
  );
}

export default LoginForm;
