import ReactDOM from "react-dom/client"
import App from "./App"
import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NotiProvider } from "./components/NotiProvider"
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./reducers/userReducer"
import blogReducer from "./reducers/blogReducer"
import { Provider } from "react-redux"

const queryClient = new QueryClient()

const store = configureStore({
  reducer: {
    user: userReducer,
    blog: blogReducer,
  },
})

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <NotiProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </NotiProvider>
    </Router>
  </QueryClientProvider>
)
