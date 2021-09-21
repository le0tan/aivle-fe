import {useHistory, useParams} from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Container,
  CssBaseline
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Cookie from "js-cookie";
import {logout, selectLoggedIn} from "../redux/authSlice";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import ReactJson from "react-json-view";

const Submissions = () => {
  const {id, task_id} = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectLoggedIn);
  const history = useHistory();
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
    Cookie.remove("loggedIn");
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
                  {submission["id"]}
                </AccordionSummary>
                <AccordionDetails>
                  <ReactJson src={submission}/>
                </AccordionDetails>
              </Accordion>
            })
        }
      </Container>
    </>
  )
}

export default Submissions;
