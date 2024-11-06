import ReactDOM from "react-dom/client"
import App from "./App"
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import notiReducer from "./reducers/notiReducer"
import userReducer from "./reducers/userReducer"
import blogReducer from "./reducers/blogReducer"
import { BrowserRouter as Router } from "react-router-dom"

const store = configureStore({
  reducer: {
    user: userReducer,
    blogs: blogReducer,
    noti: notiReducer,
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
)
