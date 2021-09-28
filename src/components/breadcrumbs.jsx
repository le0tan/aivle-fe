import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {matchPath, withRouter} from "react-router-dom";
import {Typography} from "@mui/material";

function getBreadcrumbName(pathname) {
  if (matchPath(pathname, {path: "/courses/:id/:task_id", exact: true})) {
    return "Submissions";
  } else if (matchPath(pathname, {path: "/courses/:id", exact: true})) {
    return "Tasks";
  } else if (matchPath(pathname, {path: "/courses", exact: true})) {
    return "Courses";
  } else if (matchPath(pathname, {path: "/signin", exact: true})) {
    return "Sign In";
  } else if (matchPath(pathname, {path: "/api_test", exact: true})) {
    return "API Tester";
  } else {
    return "Unknown";
  }
}

function matchSpecial(pathname) {
  if (matchPath(pathname, {path: "/account/verify_email/"})) {
    return "Verify Email";
  } else if (matchPath(pathname, {path: "/signup/"})) {
    return "Sign Up";
  } else if (matchPath(pathname, {path: "/reset_password/"})) {
    return "Reset Password";
  } else if (matchPath(pathname, {path: "/account/reset_password_confirm/"})) {
    return "Confirm Reset Password";
  } else {
    return null;
  }
}

const MuiBreadcrumbs = (props) => {
  const pathnames = props.location.pathname.split("/").filter((x) => x);
  let links;
  const special = matchSpecial(props.location.pathname);
  if (special) {
    links = (
      <Typography key={`link_0`}>{special}</Typography>
    );
  } else {
    links = pathnames.map((pathname, index) => {
      const to = `/${pathnames.slice(0, index + 1).join('/')}`;
      const last = index === pathnames.length - 1;
      const displayName = getBreadcrumbName(to);
      return last ? <Typography key={`link_${index}`}>{displayName}</Typography> :
        <Link key={`link_${index}`} underline="hover"
              onClick={() => props.history.push(to)}>{displayName}</Link>
    });
  }
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{marginTop: 2, marginLeft: 4, marginBottom: 3}}>
      <Link underline="hover" onClick={() => props.history.push("/")}>Home</Link>
      {links}
    </Breadcrumbs>
  );
}

export default withRouter(MuiBreadcrumbs);
