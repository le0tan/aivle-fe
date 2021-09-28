import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectLoggedIn} from "../redux/authSlice";
import {Box, Button, Container, CssBaseline, Snackbar, styled, TextField, Typography} from "@mui/material";
import {useForm} from "react-hook-form";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import {useHistory} from "react-router-dom";
import ReactJson from 'react-json-view'
import {useTheme} from "@mui/material/styles";
import {cleanAuthStorage} from "../lib/auth";
import FixedWidthPaper from "../components/fixedWidthPaper";
import {Alert} from "../components/alert";

const Form = styled('form')(({theme}) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  })
);

const ApiTest = () => {
  const isLoggedIn = useSelector(selectLoggedIn);
  const {register, handleSubmit} = useForm();
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [errorText, setErrorText] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const onSubmit = data => {
    axios({
      method: "get",
      url: API_BASE_URL + data.endpoint,
      headers: {
        "Authorization": "Token " + sessionStorage.getItem("token")
      }
    }).then(resp => {
      setText(JSON.stringify(resp.data));
    }).catch(e => {
      setErrorText(e.message);
      setText("");
      setOpen(true);
    });
  }
  if (!isLoggedIn) {
    cleanAuthStorage();
    dispatch(logout());
    history.push("/signin");
    return null;
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        <FixedWidthPaper>
          <Typography variant={"button"}>
            API Testing Tool
          </Typography>
          <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField variant="outlined" margin="normal" required fullWidth
                       id="api" label="API endpoint"
                       {...register("endpoint", {required: true})}/>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Submit
            </Button>
          </Form>
          <Box sx={{marginTop: 3}}>
            <ReactJson src={text === "" ? {} : JSON.parse(text)}
                       theme={theme.palette.mode === "light" ? "rjv-default" : "solarized"}
                       collapsed={2}/>
          </Box>
        </FixedWidthPaper>
      </Container>
      <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
        <Alert onClose={() => setOpen(false)}
               severity={"error"}
               sx={{width: '100%'}}>
          {errorText}
        </Alert>
      </Snackbar>
    </React.Fragment>
  )

}

export default ApiTest;
