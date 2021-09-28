import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import * as Yup from "yup";
import {useYupValidationResolver} from "../lib/yupValidationResolver";
import {useForm} from "react-hook-form";
import {API_BASE_URL} from "../constants";
import axios from "axios";
import {Alert} from "./alert";

export const CourseCard = ({id, name, semester, participating}) => {
  const history = useHistory();
  const [openJoin, setOpenJoin] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("success");
  const [snackbarText, setSnackbarText] = useState("");
  const validationSchema = Yup.object(
    {
      token: Yup.string().required('Token is required'),
    }
  );
  const resolver = useYupValidationResolver(validationSchema);
  const {handleSubmit, register, formState: {errors}} = useForm({resolver: resolver});
  const onSubmit = data => {
    axios(
      {
        method: "get",
        url: API_BASE_URL + "/api/v1/courses/join_with_invitation/",
        params: {
          token: data.token
        },
        headers: {
          "Authorization": "Token " + sessionStorage.getItem("token")
        }
      }
    ).then(resp => {
      if (resp.status === 201) {
        setOpenSnackbar(true);
        setSnackbarType("success");
        setSnackbarText("Successfully joined the course. Reloading...")
        window.location.reload();
      }
    }).catch(e => {
      if (e.response) {
        setSnackbarType("error");
        setSnackbarText(e.response.data.reason);
      } else {
        setSnackbarType("error");
        setSnackbarText(JSON.stringify(e));
      }
      setOpenSnackbar(true);
    });
  };

  return (
    <>
      <Card>
        <CardActionArea disabled={!participating} onClick={() => {
          history.push(`/courses/${id}`);
        }}>
          <CardContent>
            <Typography variant="h5" color="text.primary">{name}</Typography>
            <Typography variant="h6" color="text.secondary">{semester}</Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {
            participating ?
              <Button size="small" color="primary" disabled>
                Leave
              </Button> :
              <Button size="small" color="primary" onClick={() => setOpenJoin(true)}>
                Join
              </Button>
          }
        </CardActions>
      </Card>
      <Dialog open={openJoin} onClose={() => setOpenJoin(false)}>
        <DialogTitle>Join with invitation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To join this course, please enter the invitation token sent to you by the lecturer/course admin.
          </DialogContentText>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField id="token" label="Token" type="text" {...register("token")}
                       fullWidth autoFocus margin="normal" variant="standard"
                       error={!!errors.token}
                       helperText={errors.token?.message}/>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoin(false)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)}>Join</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarType} sx={{width: '100%'}}>
          {snackbarText}
        </Alert>
      </Snackbar>
    </>
  );
}
