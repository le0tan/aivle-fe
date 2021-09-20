import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectLoggedIn} from "../../redux/authSlice";
import {
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  styled,
  TextField,
  Typography
} from "@mui/material";
import {SignInPaper} from "../signin";
import {useForm} from "react-hook-form";
import axios from "axios";
import {API_BASE_URL} from "../../constants";
import Cookie from "js-cookie";
import {useHistory} from "react-router-dom";

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
  const dispatch = useDispatch();
  const history = useHistory();
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
      console.log(e);
    });
  }
  if (!isLoggedIn) {
    Cookie.remove("token");
    dispatch(logout());
    history.push("/signin");
    return null;
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        <SignInPaper>
          <Paper elevation={3} style={{padding: "10px"}}>
            <Typography>
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
            <TextField id="outlined-read-only-input" value={text} InputProps={{readOnly: true,}}
                       fullWidth
                       multiline margin={"normal"}
            />
          </Paper>
        </SignInPaper>
        <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      </Container>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <Form>
            <TextField label={"haha"} fullWidth variant="standard"/>
            <Button variant="contained" sx={{margin: 2}}>Submit</Button>
          </Form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )

}

export default ApiTest;
