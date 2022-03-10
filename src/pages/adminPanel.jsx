import React from "react";
import {Button, Container, CssBaseline, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import {API_BASE_URL} from "../constants";
import {styled} from "@mui/material/styles"

const AdminPanel = () => {
  const {id} = useParams();

  const AdminButton = styled(Button)(({theme}) => ({
    margin: theme.spacing(1)
  }))

  return (
    <React.Fragment>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        <Typography variant="h4" gutterBottom>
          Links to course admin pages
        </Typography>
        <Typography variant="body1" gutterBottom>
          Buttons below will redirect to aiVLE Web API pages. Use the same username and password for this website
          if credential is prompted.
        </Typography>
        <AdminButton variant={"outlined"} href={API_BASE_URL + "/api/v1/tasks/?course=" + id} target="_blank">
          Manage Tasks
        </AdminButton>
        <AdminButton variant={"outlined"} href={API_BASE_URL + "/api/v1/participations/?course=" + id} target="_blank">
          Manage Participations
        </AdminButton>
        <AdminButton variant={"outlined"} href={API_BASE_URL + "/api/v1/invitations/?course=" + id} target="_blank">
          Manage Invitations
        </AdminButton>
        <AdminButton variant={"outlined"} href={API_BASE_URL + "/api/v1/submissions/"} target="_blank">
          View Submissions
        </AdminButton>
        <AdminButton variant={"outlined"} href={API_BASE_URL + "/api/v1/jobs/"} target="_blank">
          View Jobs
        </AdminButton>
      </Container>
    </React.Fragment>
  )
}

export default AdminPanel;
