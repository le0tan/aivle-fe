import {createSlice} from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    loggedIn: sessionStorage.getItem("token") !== null
  },
  reducers: {
    login: state => {
      state.loggedIn = true;
    },
    logout: state => {
      state.loggedIn = false;
    }
  }
});

export const {login, logout} = authSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectLoggedIn = (state) => state.auth.loggedIn;

export default authSlice.reducer;
