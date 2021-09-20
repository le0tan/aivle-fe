import {configureStore} from "@reduxjs/toolkit";
import authReducer from './authSlice';
import darkModeReducer from './darkModeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    darkMode: darkModeReducer,
  }
})

export default store;
