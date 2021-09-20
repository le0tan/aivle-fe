import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectLoggedIn} from "../redux/authSlice";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import Cookie from "js-cookie";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import {useForm} from "react-hook-form";

class Task {
  id;
  courseId;
  name;
  description;
  dailySubmissionLimit;
  runtimeLimit;
  openedAt;
  closedAt;
  deadlineAt;
  hasTemplate;

  constructor(json) {
    this.id = json["id"];
    this.courseId = json["course"];
    this.name = json["name"];
    this.description = json["description"];
    this.dailySubmissionLimit = json["daily_submission_limit"];
    this.runtimeLimit = json["run_time_limit"];
    this.openedAt = new Date(json["opened_at"]);
    this.closedAt = new Date(json["closed_at"]);
    this.deadlineAt = new Date(json["deadline_at"]);
    this.hasTemplate = json["template"] !== null;
  }

  getPropertiesAsString() {
    return [
      ["Opened At", this.openedAt.toString()],
      ["Closed At", this.closedAt.toString()],
      ["Deadline At", this.deadlineAt.toString()],
      ["Daily Submission Limit", this.dailySubmissionLimit.toString()],
      ["Time Limit", this.runtimeLimit.toString()]
    ]
  }
}

const Form = styled('form')(({theme}) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  })
);


const CourseDetail = () => {
  const {id} = useParams();
  const isLoggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();
  const history = useHistory();
  const [tasks, setTasks] = useState([]);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [openTaskSubmit, setOpenTaskSubmit] = useState(false);
  const [activeTaskIndex, setactiveTaskIndex] = useState(0);
  const [file, setFile] = useState();
  // const {register, handleSubmit} = useForm();
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    axios(
      {
        method: "get", url: API_BASE_URL + `/api/v1/tasks/`, headers: {
          "Authorization": "Token " + sessionStorage.getItem("token")
        }, params: {course: id}
      }
    ).then(resp => {
      const tasks = resp.data["results"].map((value) => new Task(value));
      console.log(tasks);
      setTasks(tasks);
    }).catch(e => {
      console.log(e);
    });
  }, [id, isLoggedIn]);

  if (!isLoggedIn) {
    Cookie.remove("token");
    dispatch(logout());
    history.push("/signin");
    return (
      <></>
    )
  }

  return (
    <>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        {
          tasks.map(((task, index) => {
            return (
              <Accordion key={`task_${index}`}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon/>}
                  aria-controls="panel1a-content"
                >
                  <Typography sx={{width: '20%', flexShrink: 0}}>
                    {task.name}
                  </Typography>
                  <Typography sx={{color: 'text.secondary'}}>{task.description}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Button onClick={() => {
                    setactiveTaskIndex(index);
                    setOpenTaskDetail(true);
                  }}>Details</Button>
                  {
                    task.hasTemplate ?
                      <Button href={`${API_BASE_URL}/api/v1/tasks/${task.id}/download_template/`}>Download
                        Template</Button> : null
                  }
                  <Button onClick={() => {
                    setactiveTaskIndex(index);
                    setOpenTaskSubmit(true);
                  }}>Submit</Button>
                </AccordionDetails>
              </Accordion>
            )
          }))
        }
      </Container>
      {
        openTaskDetail ?
          <Dialog open={openTaskDetail} onClose={() => setOpenTaskDetail(false)} maxWidth="md" fullWidth>
            <DialogTitle>{tasks[activeTaskIndex].name}</DialogTitle>
            <DialogContent>
              <Table>
                <TableBody>
                  {
                    tasks[activeTaskIndex].getPropertiesAsString().map((value, index) => {
                      return <TableRow key={`task_detail_row_${index}`}>
                        <TableCell>{value[0]}</TableCell>
                        <TableCell>{value[1]}</TableCell>
                      </TableRow>
                    })
                  }
                </TableBody>
              </Table>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenTaskDetail(false)}>Close</Button>
            </DialogActions>
          </Dialog> : null
      }
      {
        openTaskSubmit ? <Dialog open={openTaskSubmit} maxWidth="md" fullWidth>
          <DialogContent>
            <Typography>
              Submit form here for task index {activeTaskIndex}
            </Typography>
            <Form>
              <Button variant="contained" component={"label"}>
                Upload File
                <input type="file" name="file" hidden
                       onChange={event => {
                         if (event.target.files !== null) {
                           setFile(event.target.files[0]);
                         }
                       }}/>
              </Button>
              <Typography>
                {file ? file["name"] : "no file selected"}
              </Typography>
              <TextField variant="outlined" margin="normal" fullWidth multiline
                         id="description" label="Description" autoFocus/>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTaskSubmit(false)}>Close</Button>
          </DialogActions>
        </Dialog> : null
      }
    </>
  );
}

export default CourseDetail;
