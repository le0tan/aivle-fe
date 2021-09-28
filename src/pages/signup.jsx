import {Avatar, Container, CssBaseline, Snackbar, Typography} from "@mui/material";
import FixedWidthPaper from "../components/fixedWidthPaper";
import SignupForm from "../components/signupForm";
import {AccountCircle} from "@mui/icons-material";
import React from "react";
import {Alert} from "../components/alert";

export const SignUpSnackbarType = {
  Success: "success",
  ExistingEmail: "existing_email",
  ExistingUsername: "existing_username",
  ExistingBoth: "existing_both",
}

const getSnackbarText = (snackbarType) => {
  switch (snackbarType) {
    case SignUpSnackbarType.Success:
      return "Success!";
    case SignUpSnackbarType.ExistingEmail:
      return "This email has been used.";
    case SignUpSnackbarType.ExistingUsername:
      return "This username has been used.";
    case SignUpSnackbarType.ExistingBoth:
      return "Both the username and email have been used.";
    default:
      return snackbarType;
  }
}

const Signup = () => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarType, setSnackBarType] = React.useState(SignUpSnackbarType.Success);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <FixedWidthPaper>
          <Avatar sx={{margin: 1, backgroundColor: "secondary.main"}}>
            <AccountCircle/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <SignupForm setOpenSnackBar={setOpenSnackBar} setSnackBarType={setSnackBarType}/>
        </FixedWidthPaper>
      </Container>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose}
               severity={snackBarType === SignUpSnackbarType.Success ? "success" : "error"}
               sx={{width: '100%'}}>
          {getSnackbarText(snackBarType)}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Signup;
