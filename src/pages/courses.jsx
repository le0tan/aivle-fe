import React, {useEffect, useState} from "react";
import {CircularProgress, Container, CssBaseline, Grid} from "@mui/material";
import {CourseCard} from "../components/courseCard";
import {useDispatch, useSelector} from "react-redux";
import {logout, selectLoggedIn} from "../redux/authSlice";
import Cookie from "js-cookie";
import {useHistory} from "react-router-dom";
import axios from "axios";
import {API_BASE_URL} from "../constants";


const CoursePage = () => {
  const isLoggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    axios(
      {
        method: "get", url: API_BASE_URL + "/api/v1/courses/", headers: {
          "Authorization": "Token " + sessionStorage.getItem("token")
        }
      }
    ).then(resp => {
      const courses = resp.data["results"];
      setCourses(courses);
      setLoading(false);
    }).catch(e => {
      console.log(e);
    });
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    Cookie.remove("loggedIn");
    dispatch(logout());
    history.push("/signin");
    return (
      <></>
    )
  }

  return (
    <React.Fragment>
      <Container component="main" maxWidth="lg">
        <CssBaseline/>
        {
          loading ? <CircularProgress/> :
            <Grid container marginTop={3} spacing={3}>
              {
                courses.map((course, idx) => {
                  return <Grid key={idx} item xs={12} sm={4}>
                    <CourseCard name={course.code} semester={`Semester ${course.semester}`}
                                id={course.id}
                                participating={course.participating}/>
                  </Grid>
                })
              }
            </Grid>
        }
      </Container>
    </React.Fragment>
  )
}

export default CoursePage;
