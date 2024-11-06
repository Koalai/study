import { createSlice } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser: (state, action) => action.payload,
    logOut: () => null,
  },
})

export const { setUser, logOut } = userSlice.actions

export default userSlice.reducer
