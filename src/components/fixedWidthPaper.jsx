import {Paper, styled} from "@mui/material";

const StyledDiv = styled('div')(({theme}) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  [theme.breakpoints.up(600)]: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(3),
  },
}));

const FixedWidthPaper = ({children}) => {
  return (
    <Paper>
      <StyledDiv>
        {children}
      </StyledDiv>
    </Paper>
  )
}

export default FixedWidthPaper;
