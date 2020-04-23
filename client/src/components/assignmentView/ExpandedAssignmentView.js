import React from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import ExQuestionCard from "./exQuestionCard";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Link, Switch, Route, useParams} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

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
    height: "90%",
    width: "95%",
    margin: "5px auto",
    border: "1px solid grey",
    overflowY: "auto"
  },
  anchorCard: {
    marginBottom: "10px",
    backgroundColor: "white",
    color: "black",
    border: "1px solid white",
    '&:hover': {
      border: "1px solid #3F51B5",
      cursor: "pointer"
    },
  },
  anchorCardActive: {
    marginBottom: "10px",
    backgroundColor: "#3F51B5",
    color: "white"
  },
  newQuestionButton: {
    margin: "auto"
  },
  anchorText: {
    textDecoration: "none",
    color: "white"
  },
  backCard: {
    height: "42px", 
    width: "95%",
    margin: "5px auto",
    border: "1px gray solid",
    backgroundColor: "white",
    padding: "10px",
    fontSize: "120%",
    fontFamily: "Cairo, sans-serif"
  },
  newQuestionTextBox: {
    width: "100%"
  },
  title: {
    fontFamily: "Cairo, sans-serif",
  },
  pageTitle: {
    fontFamily: "Cairo, sans-serif",
    display: "block",
    minHeight: "90px",
    padding: "20px 0 "
  }
})

// an expanded question view that places more emphasis on a single question
class ExpandedAssignmentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignments: [],
      questions: {},
      assignmentId: -1,
      askExpanded: false,
      newQuestion: "",
      hideNewQuestion: false,
      anonymous: false,
      submitButtonEnabled: false
    };

    this.toggleAskExpanded = this.toggleAskExpanded.bind(this);
    this.handleAnonymousChange = this.handleAnonymousChange.bind(this);
    this.handleHideNewQuestionChange = this.handleHideNewQuestionChange.bind(this);
    this.handleNewQuestionChange = this.handleNewQuestionChange.bind(this);
    this.handleNewQuestionSubmit = this.handleNewQuestionSubmit.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
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

  toggleAskExpanded(expand) {
    this.setState({askExpanded: expand});
  }

  handleHideNewQuestionChange(e) {
    console.log(e.target.checked);
    this.setState({hideNewQuestion: e.target.checked})
  }

  handleAnonymousChange(e) {
    console.log(e.target.checked);
    this.setState({anonymous: e.target.checked})
  }

  handleNewQuestionChange(event) {
    console.log(this.state.newQuestion);
    if (event.target.value !== "") {
      this.setState({newQuestion: event.target.value, submitButtonEnabled: true});
    } else {
      this.setState({newQuestion: event.target.value, submitButtonEnabled: false});
    }
  }

  handleNewQuestionSubmit(event) {
    event.preventDefault();

    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;

    if (this.state.newQuestion === "") return;
    
    const url = window.location.href

    let anchorId = -1;
    const anchorLoc = url.indexOf("anchors")
    console.log("anchorLoc: " + anchorLoc);

    if (anchorLoc !== -1) {
      // find anchor id since there is one
      const idLoc = url.indexOf("/", anchorLoc) + 1;
      const idStr = url.substring(idLoc);
      console.log("idStr: " + idStr);
      anchorId = Number(idStr);
    }
    
    this.props.submitQuestion(courseId, assignmentId, this.state.newQuestion, anchorId, this.state.hideNewQuestion, this.state.anonymous).then(success => {
      if (success) {
        console.log("success");
        
        this.props.getQuestions(courseId, assignmentId).then((questions) => {
          this.setState({questions, newQuestion: ""});
        }).catch(error => {
          console.log(error);
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  async submitAnswer(questionId, answerBody) {
    console.log("ExpandedAssignmentView submitAnswer");
    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;

    try {
      const success = await this.props.submitAnswer(courseId, assignmentId, questionId, answerBody);

      if (success) {
        console.log("success");

        const questions = await this.props.getQuestions(courseId, assignmentId);
        this.setState({questions});
      }
      return success;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  render() {
    const {classes} = this.props;
    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;
    const url = this.props.match.url; 

    const assignment = this.props.assignments[assignmentId];
    if (assignment === undefined || this.state.questions === {} || !("generalQuestions" in this.state.questions) || !("anchoredQuestions" in this.state.questions)) {
      return (
        <div style={{height: "86vh"}}>
          <h2>
          Loading...
        </h2>
        </div>
      )
    }

    const anchors = assignment.questionAnchors;
    const AnchoredQList = (props) => {
      let { anchorId } = useParams();
      return (
        this.state.questions.anchoredQuestions[anchorId].map((question, id) => (
          <ExQuestionCard 
            user={this.props.user}
            key={id} 
            question={question}
            submitAnswer={answer => this.submitAnswer(question._id, answer)}
          />
        ))
      )
    }

    return (
      <div>
        <Grid container className={classes.root}>
          <Grid item xs={3} className={classes.assignment}>
            <Card className={classes.backCard}>
              <Link to={`/courses/${courseId}`}>
                ← Back to Course
              </Link>
            </Card>
            <Card className={classes.anchorsList} raised>
            <CardHeader 
              title={
                <Typography variant="h6" style={{color: "white", fontSize: "250%"}}>
                  <strong className={classes.title}>{assignment.name}</strong>
                  <br/>
                  <span style={{fontSize: "75%"}}>Question Anchors</span>
                </Typography>
              } 
              style={{fontSize:"50%", backgroundColor:"#404040"}}
            />
            <CardContent>
              <Link to={`${url}`} className={classes.anchorText}>
                <Card className={window.location.href.endsWith(url) ? classes.anchorCardActive : classes.anchorCard}>
                  <CardContent>
                    <Typography variant="body1" className={classes.title}>
                      General Questions
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
              <div>
              {
                anchors.map((anchor, key) => (
                  
                  <Link to={`${url}/anchors/${key}`} className={classes.anchorText}>
                    <Card className={window.location.href.endsWith(`${url}/anchors/${key}`) ? classes.anchorCardActive : classes.anchorCard}>
                      <CardContent>
                        <Typography variant="body1" className={classes.title}>
                          {anchor}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              }
              </div>
              
            </CardContent>
            </Card>
          </Grid>
          <Grid item xs={9} className={classes.questions}>
            <div className={classes.questionsList}>
              <Switch>
                <Route exact path={this.props.match.path}>
                  {
                    this.state.questions.generalQuestions.map(question => (
                      <ExQuestionCard 
                        question={question} 
                        user={this.props.user}
                        submitAnswer={answer => this.submitAnswer(question._id, answer)}
                        />
                    ))
                  }
                </Route>
                <Route path={`${this.props.match.path}/anchors/:anchorId`}>
                  {
                    <AnchoredQList />
                  }
                </Route>
              </Switch>
            </div>
            

            {
              this.props.user.type !== 0 ? (
                <Card className={classes.newQuestionBox} raised>
                  {
                    !this.state.askExpanded ? (
                      <Button 
                        fullWidth 
                        variant="contained" 
                        color="secondary" 
                        className={classes.newQuestionButton}
                        onClick={e => this.toggleAskExpanded(true)}
                      >
                        New Question
                      </Button>
                    ) : (
                      // ask question
                      <div className={classes.newQuestionBox}>
                        <TextField
                          id="outlined-multiline-static"
                          label="Ask a Question..."
                          multiline
                          rows="2"
                          variant="outlined"
                          className={classes.newQuestionTextBox}
                          value={this.state.newQuestion} 
                          onChange={this.handleNewQuestionChange}
                        />

                        <FormControlLabel
                          style={{
                            fontSize: "50%"
                          }}
                          control={
                            <Checkbox
                              checked={this.state.hideNewQuestion}
                              onChange={this.handleHideNewQuestionChange}
                              color="primary"
                              size="small"
                            />
                          }
                          label={<Typography variant="subtitle1">Instructor-Only</Typography>}
                        />
                        <FormControlLabel
                          style={{
                            fontSize: "50%"
                          }}
                          control={
                            <Checkbox
                              checked={this.state.anonymous}
                              onClick={this.handleAnonymousChange}
                              color="primary"
                              size="small"
                            />
                          }
                          label="Anonymous"
                        />

                        <Button 
                          disabled={!this.state.submitButtonEnabled} 
                          color="primary" 
                          className={classes.submitButton} 
                          fullWidth 
                          variant="contained" 
                          size="small" 
                          onClick={this.handleNewQuestionSubmit}
                          >
                          Submit
                        </Button>
                      </div>
                    )
                  }
                </Card>
              ) : <></>
            }
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ExpandedAssignmentView);