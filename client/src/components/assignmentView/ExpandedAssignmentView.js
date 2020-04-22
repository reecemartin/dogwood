import React from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import ExQuestionCard from "./exQuestionCard";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const sampleQuestion = {
  author: {
    name: "John Smith"
  }, 
  content: "When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?When is Homework 5 due?",
  teacherAnswer: {
    content: "The new due date for homework 5 is April 28."
  }
}

const styles = theme => ({
  root: {
    maxHeight: "89vh"
  },
  assignment: {
    height: "89vh"
  },
  questions: {
    maxHeight: "89vh",
  },
  questionsList: {  
    padding: "10px",
    minHeight: "64vh",
    maxHeight: "73vh",
    overflowY: "auto"
  },
  newQuestionBox: {
    minHeight: "8vh",
    width: "74vw",
    position: "fixed",
    bottom: "10px",
    right: "10px",
    backgroundColor: "white",
    dropShadow: "5px 10px #888888",
    textAlign: "center",
    padding: "1vh"
  },
  anchorsList: {
    height: "98%",
    width: "95%",
    margin: "5px 5px",
    border: "1px solid grey",
    overflowY: "auto"
  },
  anchorCard: {
    marginBottom: "10px",
    backgroundColor: "#e6e6e6",
  },
  newQuestionButton: {
    margin: "auto"
  }
})

// an expanded question view that places more emphasis on a single question
class ExpandedAssignmentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignments: [],
      questions: {},
      assignmentId: -1
    };
  }

  componentDidMount() {
    console.log("ExAssignmentView componentDidMount")
    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;

    this.props.getQuestions(courseId, assignmentId).then((questions) => {
      this.setState({questions});
    }).catch(error => {
      console.log(error);
    });
  }

  render() {
    const {classes} = this.props;
    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;

    const assignment = this.props.assignments[assignmentId];
    if (assignment === undefined || this.state.questions === {} || !("generalQuestions" in this.state.questions) || !("anchoredQuestions" in this.state.questions)) {
      return (
        <h2>
          Loading...
        </h2>
      )
    }

    const anchors = assignment.questionAnchors;

    return (
      <div>
        <Grid container className={classes.root}>
          <Grid item xs={3} className={classes.assignment}>
            <Card className={classes.anchorsList} raised>
            <CardHeader 
              title={
                <Typography variant="h6" style={{color: "white", fontSize: "250%"}}>
                  <strong>{assignment.name}</strong>
                  <br/>
                  Question Anchors
                </Typography>
              } 
              style={{fontSize:"50%", backgroundColor:"#404040"}}
            />
            <CardContent>
              <Card className={classes.anchorCard}>
                    <CardContent>
                      <Typography variant="h7">
                        General Questions
                      </Typography>
                    </CardContent>
                  </Card>
              <div>
              {
                anchors.map(anchor => (
                  <Card className={classes.anchorCard}>
                    <CardContent>
                      <Typography variant="h7">
                        {anchor}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              }
              </div>
              
            </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9} className={classes.questions}>
            <div className={classes.questionsList}>
              <ExQuestionCard question={sampleQuestion}/>
              <ExQuestionCard question={sampleQuestion}/>
              <ExQuestionCard question={sampleQuestion}/>
              {/* <ExQuestionCard/>
              <ExQuestionCard/>
              <ExQuestionCard/>
              <ExQuestionCard/>
              <ExQuestionCard/> */}
            </div>
            <Card className={classes.newQuestionBox} raised>
              <Button fullWidth variant="contained" color="primary" className={classes.newQuestionButton}>
                New Question
              </Button>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ExpandedAssignmentView);