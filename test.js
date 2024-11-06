{user === null ? (
  <>
    <LoginForm
     user={user}
    />
  </>
) : (
  <>
    <div className="flex gap-4 items-center mb-4">
      <h2>{user.name} is logged in</h2>
      <button
        className="bg-slate-400 px-2 py-1 text-white rounded-md"
        onClick={handleLogout}
      >
        Log out
      </button>
    </div>
    {!blogFormVisible ? (
      <button
        type="button"
        className="bg-slate-400 px-2 py-1 text-white rounded-md mx-auto my-4"
        onClick={() => setBlogFormVisible(true)}
      >
        Add blog
      </button>
    ) : (
      <BlogForm setBlogFormVisible={setBlogFormVisible} />
    )}
      <Blogs blogs={blogs} user={user}/>
      <Users />
  </>
)
}



{user !== null && (
  <>
    <Menu />
    <Routes>
      <Route path="/" element={<LoginForm />} />
    </Routes>
  </>
)}