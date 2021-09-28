import {Avatar, Container, CssBaseline, Snackbar, Typography} from "@mui/material";
import SigninForm from "../components/signinForm";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../redux/authSlice";
import React from "react";
import FixedWidthPaper from "../components/fixedWidthPaper";
import {Alert} from "../components/alert";

export const SigninSnackBarType = {
  Success: "success",
  WrongCredentials: "wrong_credentials",
}

const SignIn = () => {
  const isLoggedIn = useSelector(selectLoggedIn);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarType, setSnackBarType] = React.useState(SigninSnackBarType.Success);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <FixedWidthPaper>
        <Avatar sx={{margin: 1, backgroundColor: "secondary.main"}}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {
          !isLoggedIn
            ? <SigninForm setOpenSnackBar={setOpenSnackBar} setSnackBarType={setSnackBarType}/>
            : <Typography>
              You are already signed in!
            </Typography>
        }
      </FixedWidthPaper>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose}
               severity={snackBarType === SigninSnackBarType.Success ? "success" : "error"}
               sx={{width: '100%'}}>
          {snackBarType === SigninSnackBarType.Success
            ? "Successfully logged in!"
            : "Wrong credentials"}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default SignIn;
