import React from "react";
import {Container, CssBaseline, Typography} from "@mui/material";
import {useParams} from "react-router-dom";

const AdminPanel = () => {
  const {id} = useParams();

  return (
    <React.Fragment>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        <Typography>
          Admin stuff for course {id}
        </Typography>
      </Container>
    </React.Fragment>
  )
}

export default AdminPanel;
