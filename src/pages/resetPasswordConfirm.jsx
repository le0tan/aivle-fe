import {Avatar, Container, CssBaseline, Snackbar, Typography} from "@mui/material";
import FixedWidthPaper from "../components/fixedWidthPaper";
import React from "react";
import {Replay} from "@mui/icons-material";
import {Alert} from "../components/alert";
import ResetPasswordConfirmForm from "../components/resetPasswordConfirmForm";

export const ResetPasswordConfirmSnackbarType = {
  Success: "success",
}

const getSnackbarText = (snackbarType) => {
  switch (snackbarType) {
    case ResetPasswordConfirmSnackbarType.Success:
      return "Success!";
    default:
      return snackbarType;
  }
}

const ResetPasswordConfirm = () => {
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarType, setSnackBarType] = React.useState(ResetPasswordConfirmSnackbarType.Success);
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
            Reset Password Confirm
          </Typography>
          <ResetPasswordConfirmForm setOpenSnackBar={setOpenSnackBar} setSnackBarType={setSnackBarType}/>
        </FixedWidthPaper>
      </Container>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose}
               severity={snackBarType === ResetPasswordConfirmSnackbarType.Success ? "success" : "error"}
               sx={{width: '100%'}}>
          {getSnackbarText(snackBarType)}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ResetPasswordConfirm;
