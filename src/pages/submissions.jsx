import {useHistory, useParams} from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Container,
  CssBaseline, Stack, Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {logout, selectLoggedIn} from "../redux/authSlice";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import ReactJson from "react-json-view";
import {useTheme} from "@mui/material/styles";
import {cleanAuthStorage} from "../lib/auth";

const Submissions = () => {
  const {id, task_id} = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectLoggedIn);
  const history = useHistory();
  const theme = useTheme();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    axios(
      {
        method: "get", url: API_BASE_URL + `/api/v1/submissions/`,
        params: {
          user: sessionStorage.getItem("user_id"),
          task: task_id,
          ordering: "-created_at", // latest first
        },
        headers: {
          "Authorization": "Token " + sessionStorage.getItem("token")
        }
      }
    ).then(resp => {
      console.log(resp.data);
      setSubmissions(resp.data["results"]);
      setLoading(false);
    }).catch(e => {
      console.log(e);
    });
  }, [id, isLoggedIn, task_id]);

  if (!isLoggedIn) {
    cleanAuthStorage();
    dispatch(logout());
    history.push("/signin");
    return null;
  }

  return (
    <>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        {
          loading ? <CircularProgress/> :
            submissions.map((submission, index) => {
              return <Accordion key={`submission_${index}`}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                  <Stack>
                    <Typography variant={"h6"}>Attempt
                      at {new Date(submission["created_at"]).toLocaleString()}</Typography>
                    {
                      submission["point"] ? <div>
                        <Typography variant={"button"}>Score: </Typography>
                        <Typography variant={"button"}>{submission["point"]}</Typography>
                      </div> : null
                    }
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <ReactJson src={submission} theme={theme.palette.mode === "light" ? "rjv-default" : "solarized"}/>
                </AccordionDetails>
              </Accordion>
            })
        }
      </Container>
    </>
  )
}

export default Submissions;
