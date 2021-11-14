import {createSlice} from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: sessionStorage.getItem("token") !== null,
    username: "not_logged_in"
  },
  reducers: {
    login: (state, username) => {
      state.loggedIn = true;
      state.username = username.payload;
    },
    logout: state => {
      state.loggedIn = false;
    }
  }
});

export const {login, logout} = authSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectLoggedIn = (state) => state.auth.loggedIn;
export const selectUsername = (state) => state.auth.username;

export default authSlice.reducer;
