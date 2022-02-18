import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectLoggedIn} from "../redux/authSlice";
import axios from "axios";
import {API_BASE_URL} from "../constants";
import Cookie from "js-cookie";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputLabel,
  Snackbar,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useForm} from "react-hook-form";
import {Alert} from "../components/alert";

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
  maxUploadSize;

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
    this.maxUploadSize = json["max_upload_size"];
  }

  getPropertiesAsString() {
    return [
      ["Opened At", this.openedAt.toString()],
      ["Closed At", this.closedAt.toString()],
      ["Deadline At", this.deadlineAt.toString()],
      ["Daily Submission Limit", this.dailySubmissionLimit.toString()],
      ["Max Upload Size (KiB)", this.maxUploadSize.toString()],
      ["Time Limit (s)", this.runtimeLimit.toString()]
    ]
  }
}

const Form = styled('form')(({theme}) => ({
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  })
);

export const SubmitTaskSnackbarType = {
  Success: "success",
  DailyLimitExceeded: "daily_limit_exceeded",
  MaxUploadSizeExceeded: "max_upload_size_exceeded",
}

const getSnackbarText = (snackbarType) => {
  switch (snackbarType) {
    case SubmitTaskSnackbarType.Success:
      return "Success!";
    case SubmitTaskSnackbarType.DailyLimitExceeded:
      return "You have exceeded your daily submission limit.";
    case SubmitTaskSnackbarType.MaxUploadSizeExceeded:
      return "Your submission is too large."
    default:
      return snackbarType;
  }
}

const CourseDetail = () => {
  const {id} = useParams();
  const isLoggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();
  const history = useHistory();
  const [tasks, setTasks] = /** @type [Task[], any] */ useState([]);
  const [openTaskDetail, setOpenTaskDetail] = useState(false);
  const [openTaskSubmit, setOpenTaskSubmit] = useState(false);
  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const [snackBarType, setSnackBarType] = React.useState(SubmitTaskSnackbarType.Success);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  };
  const {register, handleSubmit, reset} = useForm();
  const onCloseSubmitDialog = () => {
    setOpenTaskSubmit(false);
    reset();
  }
  const onSubmitForm = (data) => {
    const bodyForm = new FormData();
    const uploadFile = /** @type File */ data["file"][0];
    const taskId = data["task"];
    const maxUploadSize = tasks.filter(task => task.id === parseInt(taskId))[0].maxUploadSize;
    if (uploadFile.size > maxUploadSize * 1024) { // File.size is in bytes, max_upload_size is in KiB
      setSnackBarType(SubmitTaskSnackbarType.MaxUploadSizeExceeded);
      setOpenSnackBar(true);
      onCloseSubmitDialog();
      return;
    }
    bodyForm.append("task", taskId);
    bodyForm.append("file", uploadFile);
    bodyForm.append("description", data["description"]);
    axios(
      {
        method: "post",
        url: API_BASE_URL + "/api/v1/submissions/",
        data: bodyForm,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Token " + sessionStorage.getItem("token"),
        }
      }
    ).then(resp => {
      if (resp.status === 201) {
        setSnackBarType(SubmitTaskSnackbarType.Success);
        setOpenSnackBar(true);
      } else {
        setSnackBarType(resp.data);
        setOpenSnackBar(true);
      }
    }).catch(e => {
      if (e.response) {
        const detail = e.response.data.detail;
        if (detail === "You have exceeded your daily submission limit.") {
          setSnackBarType(SubmitTaskSnackbarType.DailyLimitExceeded);
        } else {
          setSnackBarType("Unknown error. Please see console output.");
          console.log(JSON.stringify(e.response));
        }
        setOpenSnackBar(true);
      }
    }).finally(() => {
      onCloseSubmitDialog();
    });
  };
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
      const tasks = /** @type {Task[]} */ resp.data.map((value) => new Task(value));
      setTasks(tasks);
      setLoading(false);
    }).catch(e => {
      console.log(e);
    });
  }, [id, isLoggedIn]);

  if (!isLoggedIn) {
    Cookie.remove("token");
    dispatch(logout());
    history.push("/signin");
    return null;
  }

  return (
    <>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        {
          loading ? <CircularProgress/> : tasks.map(((task, index) => {
            return (
              <Accordion key={`task_${index}`}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                  <Stack direction={"column"} spacing={1} sx={{width: "auto", display: "block"}}>
                    <Typography variant={"h5"}>{task.name}</Typography>
                    <Typography>Deadline: {task.deadlineAt.toLocaleString()}</Typography>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{color: 'text.secondary'}}>{task.description}</Typography>
                </AccordionDetails>
                <Divider/>
                <AccordionActions>
                  <Button onClick={() => {
                    setActiveTaskIndex(index);
                    setOpenTaskDetail(true);
                  }}>Details</Button>
                  {
                    task.hasTemplate ?
                      <Button href={`${API_BASE_URL}/api/v1/tasks/${task.id}/download_template/`}>Template</Button>
                      : null
                  }
                  <div style={{flexGrow: 1}}/>
                  <Button onClick={() => {
                    setActiveTaskIndex(index);
                    setOpenTaskSubmit(true);
                  }}>Submit</Button>
                  <Button onClick={() => history.push(`/courses/${id}/${task.id}`)}>
                    Submissions
                  </Button>
                </AccordionActions>
              </Accordion>
            )
          }))
        }
      </Container>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar}
               severity={snackBarType === SubmitTaskSnackbarType.Success ? "success" : "error"}
               sx={{width: '100%'}}>
          {getSnackbarText(snackBarType)}
        </Alert>
      </Snackbar>
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
          <DialogTitle>
            New submission to: {tasks[activeTaskIndex].name}
          </DialogTitle>
          <DialogContent>
            <Form onSubmit={handleSubmit(onSubmitForm)}>
              <InputLabel>Agent File</InputLabel>
              <input {...register("file", {required: true})} type="file" name="file" accept="application/zip" required/>
              <TextField variant="outlined" margin="normal" fullWidth multiline {...register("description")}
                         id="description" label="Description (optional)"/>
              <input {...register("task", {required: true})} type="text" name="task"
                     value={tasks[activeTaskIndex].id} hidden/>
              <Button type={"submit"}>Submit</Button>
            </Form>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseSubmitDialog}>Close</Button>
          </DialogActions>
        </Dialog> : null
      }
    </>
  );
}

export default CourseDetail;
