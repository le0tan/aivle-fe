import {Button, Container, CssBaseline, Divider, Typography} from "@mui/material";
import React from "react";

const Home = () => {
  return (
    <>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        <Typography variant="h4" gutterBottom>
          Welcome to aiVLE!
        </Typography>
        <Typography variant="body1" gutterBottom>
          Login first, then open the drawer by pressing the top left corner button. Enjoy~
        </Typography>
        <Divider sx={{marginTop: 2, marginBottom: 2}}/>
        <Button variant={"outlined"} href="https://edu-ai.github.io/aivle-docs/" target="_blank">
          Documentation
        </Button>
      </Container>
    </>
  )
}

export default Home;
