import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import axios from "axios";
import Cookie from "js-cookie";
import {useDispatch} from "react-redux";
import {login} from "../redux/authSlice";
import {SigninSnackBarType} from "../pages/signin";
import {styled} from "@mui/material";
import {API_BASE_URL} from "../constants";

const Form = styled('form')(({theme}) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  })
);

const SubmitButton = styled(Button)(({theme}) => ({
  margin: theme.spacing(3, 0, 2),
}));

const SigninForm = (props) => {
  const {register, handleSubmit} = useForm();
  const [disable, setDisable] = useState(false);
  const [remember, setRemember] = useState(() => {
    return Cookie.get("remember") === "true";
  });
  useEffect(() => {
    Cookie.set("remember", remember ? "true" : "false");
  }, [remember]);
  const dispatch = useDispatch();

  const onSubmit = data => {
    console.log(data);
    const bodyForm = new FormData();
    bodyForm.append("username", data.username);
    bodyForm.append("password", data.password);
    setDisable(true);
    axios(
      {
        method: "post",
        url: API_BASE_URL + "/dj-rest-auth/login/",
        data: bodyForm,
        headers: {"Content-Type": "multipart/form-data"}
      }
    ).then(resp => {
      sessionStorage.setItem("token", resp.data["key"]);
      sessionStorage.setItem("user_id", resp.data["user"]);
      dispatch(login());
      props.setSnackBarType(SigninSnackBarType.Success);
      props.setOpenSnackBar(true);
    }).catch(() => {
      props.setSnackBarType(SigninSnackBarType.WrongCredentials);
      props.setOpenSnackBar(true);
    }).finally(() => {
      setDisable(false);
    })
  };
  return (
    <React.Fragment>
      <Form noValidate onSubmit={handleSubmit(onSubmit)}>
        <TextField variant="outlined" margin="normal" required fullWidth
                   id="username" label="Username" autoComplete="username" autoFocus
                   {...register("username", {required: true})}/>
        <TextField variant="outlined" margin="normal" required fullWidth
                   label="Password" type="password" id="password"
                   autoComplete="current-password"
                   {...register("password", {required: true})}/>
        <FormControlLabel control={<Checkbox value="remember" color="primary" checked={remember}
                                             onChange={e => setRemember(e.target.checked)}/>}
                          label="Remember me"
        />
        <SubmitButton type="submit" fullWidth variant="contained" color="primary"
                      disabled={disable}>
          Sign In
        </SubmitButton>
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Form>
    </React.Fragment>
  )
}

export default SigninForm;
