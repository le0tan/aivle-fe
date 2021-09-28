import {Avatar, Container, CssBaseline, Snackbar, Typography} from "@mui/material";
import FixedWidthPaper from "../components/fixedWidthPaper";
import ResetPasswordForm from "../components/resetPasswordForm";
import React from "react";
import {Replay} from "@mui/icons-material";
import {Alert} from "../components/alert";

export const ResetPasswordSnackbarType = {
  Success: "success",
}

const getSnackbarText = (snackbarType) => {
  switch (snackbarType) {
    case ResetPasswordSnackbarType.Success:
      return "Success!";
    default:
      return snackbarType;
  }
}

const ResetPassword = () => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarType, setSnackBarType] = React.useState(ResetPasswordSnackbarType.Success);
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
            <Replay/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset Password
          </Typography>
          <Typography variant={"body2"} sx={{marginTop: 1}}>
            An email with instruction of how to reset your password will be sent
            to your address, if you have registered an account using that email address.
          </Typography>
          <ResetPasswordForm setOpenSnackBar={setOpenSnackBar} setSnackBarType={setSnackBarType}/>
        </FixedWidthPaper>
      </Container>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose}
               severity={snackBarType === ResetPasswordSnackbarType.Success ? "success" : "error"}
               sx={{width: '100%'}}>
          {getSnackbarText(snackBarType)}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ResetPassword;
