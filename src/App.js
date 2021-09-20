import React from 'react';
import {AppBar, Button, IconButton, Link, Toolbar, Typography} from "@mui/material";
import {createTheme, ThemeProvider, useTheme} from "@mui/material/styles";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectLoggedIn} from "./redux/authSlice";
import {Link as RouterLink, Route, Switch, useHistory} from "react-router-dom";
import Cookie from "js-cookie";
import MenuIcon from "@mui/icons-material/Menu";
import SignIn from "./pages/signin";
import ApiTest from "./pages/api_test";
import {DarkModeSwitch} from "./components/darkModeSwitch";
import CoursePage from "./pages/courses";
import CourseDetail from "./pages/course_detail";
import MuiBreadcrumbs from "./components/breadcrumbs";
import {selectIsDark, setDark, setLight} from "./redux/darkModeSlice";

const MyApp = () => {
  const isLoggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleLogout = () => {
    Cookie.remove("token");
    dispatch(logout());
    history.push("/signin");
  }
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const onSwitchChange = (event) => {
    colorMode.setColorMode(event.target.checked);
    sessionStorage.setItem("mode", event.target.checked ? "dark" : "light");
  };

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" size="large" sx={{marginRight: 2}}>
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" sx={{flexGrow: 1, textAlign: "left"}}>
            <Link color="inherit" underline={"none"} component={RouterLink} to="/">aiVLE</Link>
          </Typography>
          <Button color="inherit" component={RouterLink} to="/courses">Courses</Button>
          <Button color="inherit" component={RouterLink} to="/api_test">API Test</Button>
          {
            !isLoggedIn
              ? <Button color="inherit" component={RouterLink} to="/signin">Login</Button>
              : <Button color="inherit" onClick={handleLogout}>Logout</Button>
          }
          <DarkModeSwitch checked={theme.palette.mode === "dark"} onChange={onSwitchChange}/>
        </Toolbar>
      </AppBar>
      <MuiBreadcrumbs/>
      <Switch>
        <Route path="/signin">
          <SignIn/>
        </Route>
        <Route path="/api_test">
          <ApiTest/>
        </Route>
        <Route path="/courses/:id">
          <CourseDetail/>
        </Route>
        <Route path="/courses">
          <CoursePage/>
        </Route>
        <Route path="/">
          <Typography>
            Welcome!
          </Typography>
        </Route>
      </Switch>
    </React.Fragment>
  );
}

const ColorModeContext = React.createContext({
  setColorMode: (isDark) => {
  }
});

export default function ToggleColorMode() {
  const isDark = useSelector(selectIsDark);
  const dispatch = useDispatch();
  const colorMode = React.useMemo(
    () => ({
      setColorMode: (isDark) => {
        if (isDark) dispatch(setDark());
        else dispatch(setLight());
      }
    }),
    [dispatch],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
        },
      }),
    [isDark],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <MyApp/>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
