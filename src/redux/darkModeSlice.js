import {createSlice} from '@reduxjs/toolkit'

export const darkModeSlice = createSlice({
  name: "darkMode",
  initialState: {
    isDark: sessionStorage.getItem("mode") === "dark"
  },
  reducers: {
    setDark: state => {
      state.isDark = true;
    },
    setLight: state => {
      state.isDark = false;
    }
  }
});

export const {setDark, setLight} = darkModeSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectIsDark = (state) => state.darkMode.isDark;

export default darkModeSlice.reducer;
