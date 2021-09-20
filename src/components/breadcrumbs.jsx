import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import {matchPath, withRouter} from "react-router-dom";
import {Typography} from "@mui/material";

function getBreadcrumbName(pathname) {
  if (matchPath(pathname, {path: "/courses/:id"})) {
    return "Tasks";
  } else if (matchPath(pathname, {path: "/courses"})) {
    return "Courses";
  } else if (matchPath(pathname, {path: "/signin"})) {
    return "Sign In";
  } else if (matchPath(pathname, {path: "/api_test"})) {
    return "API Tester";
  } else {
    return "Unknown";
  }
}

const MuiBreadcrumbs = (props) => {
  const pathnames = props.location.pathname.split("/").filter((x) => x);
  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{marginTop: 2, marginLeft: 3}}>
      <Link underline="hover" onClick={() => props.history.push("/")}>Home</Link>
      {
        pathnames.map((pathname, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const last = index === pathnames.length - 1;
          const displayName = getBreadcrumbName(to);
          return last ? <Typography key={`link_${index}`}>{displayName}</Typography> :
            <Link key={`link_${index}`} underline="hover"
                  onClick={() => props.history.push(to)}>{displayName}</Link>
        })
      }
    </Breadcrumbs>
  );
}

export default withRouter(MuiBreadcrumbs);
