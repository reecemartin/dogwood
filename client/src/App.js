import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import NotificationsIcon from '@material-ui/icons/Notifications';
import withStyles from "@material-ui/core/styles/withStyles";
import './App.css';
import CssBaseline from "@material-ui/core/CssBaseline";

// page components
import Home from "./components/home/home";
import AssignmentView from "./components/assignmentView/AssignmentView";
import CourseView from "./components/courseView/CourseView";
import ExpandedAssignmentView from './components/assignmentView/ExpandedAssignmentView';

// test user to use before we implement authentication
const user = {
  "userId": 77126,
  "type": 1
}

const styles = (theme) => ({
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    fontFamily: "Cairo, sans-serif",
    color: "white",
    textDecoration: "none"
  }, 
  root: {
    backgroundColor: "#DAE0E6",
    height: "100vh"
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
})

class App extends Component {
  constructor(props) {
    super(props);

    this.assignments = {};
    this.state = {
      course: {},
      assignments: {}
    }

    // TODO: change this to work with other courses
    this.getCourseInfo(6119);
    this.getAllAssignments(6119).then(assignments => {
      // for (let i = 0 ; i < assignments.length)
      console.log(assignments)
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidMount() {
    this.getCourseInfo(6119).then(course => {
      console.log(course);
    }).catch(error => {
      console.log(error);
    });
    this.getAllAssignments(6119).then(assignments => {
      // for (let i = 0 ; i < assignments.length)
      console.log(assignments)
    }).catch(error => {
      console.log(error);
    });
  }

  async getCourseInfo(courseId) {
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      if (res.status !== 200) return {};
      
      const course = await res.json();
      this.setState({course: course});
      return course;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async getAllAssignments(courseId) {
    // get all assignments of a course
    const assignments = this.state.assignments;
    try {
      // get all assignment ids
      const res = await fetch(`/api/courses/${courseId}/assignments`);
      if (res.status !== 200) return assignments;
      
      const assignmentIds = await res.json();

      // for each assignment id, get the corresponding assignment
      for (let i = 0; i < assignmentIds.length; i++) {
        const newAssignment = await this.getAssignmentInfo(courseId, assignmentIds[i]);
        console.log(newAssignment)

        assignments[assignmentIds[i]] = newAssignment;
      }

      console.log(assignments)
      return assignments;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async getAssignmentInfo(courseId, assignmentId) {
    // get assignment info from backend
    console.log("getAssignmentInfo");
    console.log("courseId: " + courseId + " assignmentId: " + assignmentId);
    // TODO: Fetch data from backend

    try {
      const assignmentInfo = await fetch("/api/courses/" + courseId + "/assignments/" + assignmentId + "/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
      });

      const assignment = await assignmentInfo.json();
      console.log(assignment);
      return assignment
    } catch (error) {
      console.log(error);
      return {}
    }
  }

  async getAssignmentQuestions(courseId, assignmentId) {
    // get assignment questions from backend
    console.log("getAssignmentQuestions");
    console.log("courseId: " + courseId + " assignmentId: " + assignmentId);
    
    try {
      const questionsJson = await fetch("/api/courses/" + courseId + "/assignments/" + assignmentId + "/questions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        },
      });

      const questions = await questionsJson.json();
      console.log(questions);

      // sanitize questions: hide hidden questions from students, anonymize questions 
      if (user.type !== 0) {
        const predicate = item => (parseInt(item.userId) === user.userId || !item.hidden);

        questions.generalQuestions = questions.generalQuestions.filter(predicate);
        for (let i in questions.generalQuestions) {
          if (questions.generalQuestions[i].anonymous === true && user.userId !== questions.generalQuestions[i].author.userId) {
            questions.generalQuestions[i].author = {name: "Anonymous"};
          }
        }

        for (let i in questions.anchoredQuestions) {
          questions.anchoredQuestions[i] = questions.anchoredQuestions[i].filter(predicate);
          for (let j in questions.anchoredQuestions[i]) {
            if (questions.anchoredQuestions[i][j].anonymous === true && user.userId !== questions.generalQuestions[i].author.userId) {
              questions.anchoredQuestions[i][j].author = {name: "Anonymous"};
            }
          }
        }
      }

      return questions;
    } catch (error) {
      console.log(error);
      return {}
    }
  }

  async submitQuestion(courseId, assignmentId, questionBody, anchorId, hide, anonymous) {
    try {
      // body: {questionBody, user, anchorId}
      const reqBody = {
        questionBody: questionBody,
        user: user,
        hide: hide,
        anonymous: anonymous
      }
      if (anchorId !== -1) {
        reqBody.anchorId = anchorId;
      }

      console.log("App submitQuestion")
      console.log(reqBody);

      const newQuestion = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}/questions/`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify(reqBody)
        }
      )

      console.log(newQuestion);

      if (newQuestion.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async deleteQuestion(courseId, assignmentId, questionId, hide) {
    try {
      const reqBody = {
        hide: hide,
        user: user
      };

      console.log("App deleteQuestion");
      console.log(reqBody);

      const deletedQuestion = await fetch(`/api/courses/${courseId}/assignments/${assignmentId}/questions/${questionId}`, 
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify(reqBody)
        }
      );

      console.log(deletedQuestion);

      if (deletedQuestion.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  // will replace whatever existing answer there is
  async submitTeacherAnswer(courseId, assignmentId, questionId, answerBody) {
    try {
      // body: {answerBody, user}
      const reqBody = {
        answerBody: answerBody,
        user: user
      }

      console.log("App submitTeacherAnswer")
      console.log(reqBody);

      const url = `/api/courses/${courseId}/assignments/${assignmentId}/questions/${questionId}/teacherAnswer`;
      console.log(url)

      const newAnswer = await fetch(url, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: JSON.stringify(reqBody)
        }
      )

      console.log(newAnswer);

      if (newAnswer.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async submitStudentAnswer(courseId, assignmentId, questionId, answerBody) {

  }

  render() {
    const {classes} = this.props;
    return (
      <Router>
        <div className={classes.root} style={{minHeight: "100%", height: "auto"}}>
        <CssBaseline />
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            
              <Typography align="left" variant="h6">
              <Link to="/"  className={classes.title}>
                dogwood
                </Link>
              </Typography>
           
            {/* <IconButton color="inherit">
              <NotificationsIcon/>
            </IconButton> */}
          </Toolbar>
        </AppBar>

          <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
            {/* view assignment */}
             <Route 
              path="/courses/:courseId/assignments/:assignmentId"
              render={
                (props) => (
                  // <AssignmentView 
                  //   assignments={this.state.assignments} 
                  //   user={user} 
                  //   getQuestions={this.getAssignmentQuestions.bind(this)} 
                  //   {...props} 
                  //   submitQuestion={this.submitQuestion.bind(this)} 
                  //   submitTeacherAnswer={this.submitTeacherAnswer.bind(this)}
                  //   deleteQuestion={this.deleteQuestion.bind(this)}
                  // />
                  <ExpandedAssignmentView
                    {...props}
                    assignments={this.state.assignments}
                    user={user}
                    getQuestions={this.getAssignmentQuestions.bind(this)}
                  />
                )
              }
            /> 
            <Route
              path="/courses/:courseId"
              render={
                (props) => <CourseView {...props} user={user} course={this.state.course} assignments={this.state.assignments}/>
              }
            />
            
          </Switch>
        </div>
      </Router>
    );
  }
}

export default withStyles(styles)(App);
