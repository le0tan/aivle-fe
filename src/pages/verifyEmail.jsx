import {Button, Container, CssBaseline, Divider, Typography} from "@mui/material";
import useQuery from "../lib/useQuery";
import {useForm} from "react-hook-form";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";

const VerifyEmail = () => {
  const query = useQuery();
  const history = useHistory();
  const {register, handleSubmit} = useForm();
  const [verified, setVerified] = useState(false);
  const onSubmit = data => {
    const bodyForm = new FormData();
    bodyForm.append("key", data.key);
    axios(
      {
        method: "post",
        url: API_BASE_URL + "/dj-rest-auth/registration/verify-email/",
        data: bodyForm,
        headers: {"Content-Type": "multipart/form-data"}
      }
    ).then(resp => {
      if (resp.status === 200) {
        setVerified(true);
        setTimeout(() => {
          history.push("/signin");
        }, 2000);
      }
    }).catch((e) => {
      console.log(e);
    });
  };
  return (
    <>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        <Typography variant="h4" gutterBottom>
          Email Verification
        </Typography>
        <Typography variant="body1" gutterBottom>
          Click the button below to verify your email address.
        </Typography>
        <Divider sx={{marginTop: 2, marginBottom: 2}}/>
        {
          verified ? <Typography>Success! You will be redirected to sign-in page in several seconds...</Typography>
            : <form onSubmit={handleSubmit(onSubmit)}>
              <input name="key" value={query.get("key")} {...register("key", {required: true})} hidden/>
              <Button type={"submit"} variant={"outlined"}>Verify</Button>
            </form>
        }
      </Container>

    </>
  )
}

export default VerifyEmail;
