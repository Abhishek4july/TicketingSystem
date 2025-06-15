import { createSlice } from "@reduxjs/toolkit";

const storedUser = JSON.parse(localStorage.getItem("user"));
const isAuth = localStorage.getItem("auth") === "true";

const initialState = {
  isAuthenticated: localStorage.getItem('auth') === 'true',
  isAdmin: JSON.parse(localStorage.getItem('user') || '{}')?.role === 'admin',
  user: JSON.parse(localStorage.getItem('user') || '{}'),
};




const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isAdmin = action.payload.user?.isAdmin || false;
    },
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isAdmin = false;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
