import {useHistory, useParams} from "react-router-dom";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {logout, selectLoggedIn} from "../redux/authSlice";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {API_BASE_URL, JobErrorMap, JobStatusMap} from "../constants";
import ReactJson from "react-json-view";
import {useTheme} from "@mui/material/styles";
import {cleanAuthStorage} from "../lib/auth";
import {CheckCircle} from "@mui/icons-material";
import Button from "@mui/material/Button";

const markForGrading = (sid) => {
  axios(
    {
      method: "get",
      url: API_BASE_URL + `/api/v1/submissions/${sid}/mark_for_grading/`,
      headers: {
        "Authorization": "Token " + sessionStorage.getItem("token")
      },
    }
  ).then(() => {
    // console.log(resp);
    window.location.reload();
  }).catch(e => {
    console.log(e);
  });
};

const Submissions = () => {
  const {id, task_id} = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectLoggedIn);
  const history = useHistory();
  const theme = useTheme();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobStatus, setJobStatus] = useState();
  const [openJobStatus, setOpenJobStatus] = useState(false);
  const [loadingJobStatus, setLoadingJobStatus] = useState(false);

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
      setSubmissions(resp.data);
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

  const loadJobStatus = (id) => {
    setLoadingJobStatus(true)
    axios(
      {
        method: "get", url: API_BASE_URL + `/api/v1/jobs/`,
        params: {
          submission: id,
          ordering: "-created_at",
        },
        headers: {
          "Authorization": "Token " + sessionStorage.getItem("token")
        }
      }
    ).then(resp => {
      const response = resp.data
      if (response.count === 0) {
        console.log(`job related to submission ID ${id} is not found`)
      } else {
        setJobStatus(response.results[0])
        setOpenJobStatus(true)
      }
    }).catch(e => {
      console.log(e)
    }).finally(() => {
      setLoadingJobStatus(false)
    })
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
                    <Stack direction={"row"}>
                      <Typography variant={"h6"}>
                        Attempt at {new Date(submission["created_at"]).toLocaleString()}
                      </Typography>
                      {submission["marked_for_grading"] ?
                        <CheckCircle sx={{color: "success.light", marginLeft: 0.5}}/> : null}
                    </Stack>
                    {
                      submission["point"] ? <div>
                        <Typography variant={"button"}>Score: </Typography>
                        <Typography variant={"button"}>{submission["point"]}</Typography>
                      </div> : null
                    }
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <ReactJson src={submission} theme={theme.palette.mode === "light" ? "rjv-default" : "solarized"}
                             collapsed={true}/>
                </AccordionDetails>
                <AccordionActions sx={{justifyContent: "left"}}>
                  <Button onClick={() => markForGrading(submission["id"])}>
                    Mark For Grading
                  </Button>
                  <Button onClick={() => {
                    loadJobStatus(submission["id"])
                  }} disabled={loadingJobStatus}>
                    Fetch Job Status
                  </Button>
                </AccordionActions>
              </Accordion>
            })
        }
        <Dialog open={openJobStatus} onClose={() => setOpenJobStatus(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            Latest Job Status
          </DialogTitle>
          <DialogContent>
            {
              jobStatus ? <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Worker Name</TableCell>
                    <TableCell>{jobStatus.worker_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>{JobStatusMap[jobStatus.status]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Error</TableCell>
                    <TableCell>{jobStatus.error ? JobErrorMap[jobStatus.error] : "None"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table> : "Loading"
            }
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenJobStatus(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  )
}

export default Submissions;
