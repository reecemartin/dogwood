import React from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider"; 
import withStyles from "@material-ui/core/styles/withStyles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Link} from "react-router-dom";

const styles = {
  title: {
    fontFamily: "Cairo, sans-serif"
  },
  course: {
    padding: "10px",
    fontFamily: "Roboto, sans-serif"
  },
  assignmentTableCell: {
    fontFamily: "Cairo, sans-serif",
    fontSize: "120%"
  }
}

const AssignmentRow = (props) => {
  const assignment = props.assignment;
  return (
    <div>
      <TableRow key={assignment.name}>
        <TableCell component="th" scope="row">
          {assignment.name}
        </TableCell>
        <TableCell>{assignment.dueDate ? assignment.dueDate : "No Due Date"}</TableCell>
      </TableRow>
    </div>
  )
};

class CourseView extends React.Component {
  componentDidMount() {
    console.log("CourseView componentDidMount")
  }
  
  render() {
    const course = this.props.course;
    const { classes } = this.props;
    console.log(course);
    const assignments = this.props.assignments !== undefined ? this.props.assignments: {};
    console.log(assignments);
    const upcoming = [];
    const past = [];
    
    // split upcoming and past assignments

    return (
      <div>
        <div className={classes.course}>
          <Typography variant="h3" className={classes.title}>
            {course.name}
          </Typography>
          <Divider/>
          <br/>

          <Typography variant="h5" className={classes.title}>
            Upcoming Assignments
          </Typography>

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="assignment table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.assignmentTableCell}><strong>Assignment Name</strong></TableCell>
                  <TableCell className={classes.assignmentTableCell}><strong>Due Date</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(assignments).map(aId => (
                  <TableRow key={assignments[aId].name}>
                  <TableCell className={classes.assignmentTableCell} scope="row">
                    <Link to={"/courses/" + course.courseId + "/assignments/" + aId}>
                      {assignments[aId].name}
                    </Link>
                  </TableCell>
                  <TableCell className={classes.assignmentTableCell}>{assignments[aId].dueDate ? assignments[aId].dueDate : "No Due Date"}</TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <br/>

          <Typography variant="h5" className={classes.title}>
            Past Assignments
          </Typography>

          <div>

          </div>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(CourseView);