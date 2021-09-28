import * as Yup from 'yup';
import {useForm} from "react-hook-form";
import {useState} from "react";
import {Button, styled, TextField, Typography} from "@mui/material";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import {useYupValidationResolver} from "../lib/yupValidationResolver";
import {ResetPasswordSnackbarType} from "../pages/resetPassword";

const Form = styled('form')(({theme}) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  })
);

const ResetPasswordForm = (props) => {
  const validationSchema = Yup.object(
    {
      email: Yup.string().required('Email is required').email('Email is invalid'),
    }
  );
  const resolver = useYupValidationResolver(validationSchema);
  const {handleSubmit, register, formState: {errors}} = useForm({resolver: resolver});
  const [disable, setDisable] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [email, setEmail] = useState("");
  const onSubmit = data => {
    const bodyForm = new FormData();
    bodyForm.append("email", data.email);
    setEmail(data.email);
    setDisable(true);
    axios(
      {
        method: "post",
        url: API_BASE_URL + "/dj-rest-auth/password/reset/",
        data: bodyForm,
        headers: {"Content-Type": "multipart/form-data"}
      }
    ).then(resp => {
      if (resp.status === 200) {
        props.setSnackBarType(ResetPasswordSnackbarType.Success);
        props.setOpenSnackBar(true);
        setShowForm(false);
      } else {
        props.setSnackBarType(resp.data);
        props.setOpenSnackBar(true);
      }
    }).catch(e => {
      if (e.response) {
        const data = e.response.data;
        props.setSnackBarType(JSON.stringify(data));
      } else {
        props.setSnackBarType("Unknown error");
      }
      props.setOpenSnackBar(true);
    }).finally(() => {
      setDisable(false);
    })
  };
  if (showForm) {
    return (
      <>
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextField id="email" name="email" label="Email" fullWidth required margin="normal"
                     {...register('email')}
                     error={!!errors.email}
                     helperText={errors.email?.message}/>
          <Button variant="contained" color="primary" type="submit" fullWidth
                  sx={{marginTop: 3, marginBottom: 2}} disabled={disable}>
            Send
          </Button>
        </Form>
      </>
    )
  } else {
    return (
      <>
        <Typography sx={{marginTop: 2}} variant={"body1"}>
          Please check your inbox at {email}
        </Typography>
      </>
    )
  }
}

export default ResetPasswordForm;
