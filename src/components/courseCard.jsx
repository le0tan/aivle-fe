import {Button, Card, CardActionArea, CardActions, CardContent, Typography} from "@mui/material";
import React from "react";
import {useHistory} from "react-router-dom";

export const CourseCard = ({id, name, semester, participating}) => {
  const history = useHistory();
  return (
    <Card>
      <CardActionArea disabled={!participating} onClick={() => {
        history.push(`/courses/${id}/`);
      }}>
        <CardContent>
          <Typography variant="h5" color="text.primary">{name}</Typography>
          <Typography variant="h6" color="text.secondary">{semester}</Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {
          participating ?
            <Button size="small" color="primary">
              Leave
            </Button> :
            <Button size="small" color="primary">
              Join
            </Button>
        }
      </CardActions>

    </Card>
  );
}
