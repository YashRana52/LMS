import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    userLoggedIn: (state, action) => {
      ((state.user = action.payload.user), (state.isAuthenticated = true));
    },
    userLoggedOut: (state) => {
      ((state.user = null), (state.isAuthenticated = false));
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
