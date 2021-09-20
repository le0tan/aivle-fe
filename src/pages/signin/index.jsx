import {Avatar, Container, CssBaseline, Paper, Snackbar, styled, Typography} from "@mui/material";
import SigninForm from "../../components/signinForm";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../../redux/authSlice";
import React from "react";
import MuiAlert from '@mui/material/Alert';

export const SignInPaper = styled('div')(({theme}) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  [theme.breakpoints.up(600)]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
  },
}));

const LoginIcon = styled(Avatar)(({theme}) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.secondary.main,
}));

export const Alert = React.forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


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
      <Paper>
        <SignInPaper>
          <LoginIcon>
            <LockOutlinedIcon/>
          </LoginIcon>
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
        </SignInPaper>
      </Paper>
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
