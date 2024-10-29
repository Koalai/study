
import PropTypes from "prop-types";

function LoginForm({
  username,
  password,
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
}) {
  return (
    <form className={`flex flex-col w-52`} onSubmit={handleLogin}>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        className="border"
        value={username}
        onChange={handleUsernameChange}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        className="border"
        value={password}
        onChange={handlePasswordChange}
      />
      <button
        className="bg-slate-400 mx-auto mt-2 text-white px-2 py-1 rounded-md"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}


LoginForm.propTypes = {
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
};

export default LoginForm;
