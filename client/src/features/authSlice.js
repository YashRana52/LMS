import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    userLoggedIn: (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // 🔹 Optional: token localStorage me save (if not already done in RTK Query)
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    },
    userLoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // 🔹 Remove token from localStorage
      localStorage.removeItem("token");
    },
  },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
