import * as Yup from 'yup';
import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {Button, styled, TextField, Typography} from "@mui/material";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import {useYupValidationResolver} from "../lib/yupValidationResolver";
import {ResetPasswordConfirmSnackbarType} from "../pages/resetPasswordConfirm";
import useQuery from "../lib/useQuery";
import {useHistory} from "react-router-dom";

const Form = styled('form')(({theme}) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  })
);

const ResetPasswordConfirmForm = (props) => {
  const validationSchema = Yup.object(
    {
      uid: Yup.string().required('UID is required (did you miscopied the URL?)'),
      token: Yup.string().required('token is required (did you miscopied the URL?)'),
      password: Yup.string().required('Password is required'),
      confirmPassword: Yup.string().required('Confirm Password is required')
        .oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
    }
  );
  const resolver = useYupValidationResolver(validationSchema);
  const {handleSubmit, register, formState: {errors}} = useForm({resolver: resolver});
  const [disable, setDisable] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [prompt, setPrompt] = useState("");
  const query = useQuery();
  const history = useHistory();
  useEffect(() => {
    if (!query.get("uid") || !query.get("token")) {
      setPrompt("Invalid URL");
      setShowForm(false);
      props.setSnackBarType("UID or token missing in the URL - did you miscopy the URL?");
      props.setOpenSnackBar(true);
    }
  }, [prompt, props, query]);
  const onSubmit = data => {
    const bodyForm = new FormData();
    bodyForm.append("uid", data.uid);
    bodyForm.append("token", data.token);
    bodyForm.append("new_password1", data.password);
    bodyForm.append("new_password2", data.confirmPassword);
    setDisable(true);
    axios(
      {
        method: "post",
        url: API_BASE_URL + "/dj-rest-auth/password/reset/confirm/",
        data: bodyForm,
        headers: {"Content-Type": "multipart/form-data"}
      }
    ).then(resp => {
      if (resp.status === 200) {
        props.setSnackBarType(ResetPasswordConfirmSnackbarType.Success);
        props.setOpenSnackBar(true);
        setPrompt("Success! You will be redirected to sign-in page in several seconds...")
        setShowForm(false);
        setTimeout(() => {
          history.push("/signin");
        }, 2000);
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
        <Form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete={"off"}>
          <input id="uid" name="uid" type="text" readOnly hidden
                 value={query.get("uid") || ""} {...register("uid")}/>
          <input id="token" name="token" type="text" readOnly hidden
                 value={query.get("token") || ""} {...register("token")}/>
          <TextField id="password" name="password" label="Password" fullWidth required margin="normal"
                     type="password"
                     {...register('password')}
                     error={!!errors.password}
                     helperText={errors.password?.message}/>
          <TextField id="confirmPassword" name="confirmPassword" label="Confirm Password" fullWidth required
                     margin="normal" type="password"
                     {...register('confirmPassword')}
                     error={!!errors.confirmPassword}
                     helperText={errors.confirmPassword?.message}/>
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
          {prompt}
        </Typography>
      </>
    )
  }
}

export default ResetPasswordConfirmForm;
