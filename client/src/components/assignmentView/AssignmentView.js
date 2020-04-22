import React, {useState} from "react";
import Drawer from "@material-ui/core/Drawer";
import withStyles from "@material-ui/core/styles/withStyles";
import { Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import QuestionCard from "./questionCard";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import MouseTooltip from 'react-sticky-mouse-tooltip';
import AnchorPreview from './anchorPreview';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import {
  Route,
  Link,
  Switch,
  useParams,
  useRouteMatch
} from "react-router-dom";

// parse html
import HtmlToReact from "html-to-react"
const parser = new HtmlToReact.Parser()

// anchor
const Anchor = (props) => {
  let { url } = useRouteMatch();
  const [previewOpen, setPreviewOpen] = useState(false);

  let questions = [];
  let newUrl = url;
  if (props.anchorId === -1) {
    questions = props.questions.generalQuestions;
  } else {
    questions = props.questions.anchoredQuestions[props.anchorId];
    newUrl = `${url}/anchors/${props.anchorId}`;
  }

  return (  
    <div id={`anchor-gen`}>
      <Link onMouseEnter={() => setPreviewOpen(true)} onMouseLeave={() => setPreviewOpen(false)} to={newUrl}>{props.children}</Link>

      <MouseTooltip
        visible={previewOpen}
        offsetX={15}
        offsetY={10}
      >
        <AnchorPreview questions={questions} />
        
      </MouseTooltip>
    </div>
  )
}

const AssignmentBody = (props) => {
  console.log(props);
  const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

  const processingInstructions = [
    {
      shouldProcessNode: function (node) {
        return node.attribs && node.attribs.anchorid;
      },
      processNode: function (node, children, index) {
        return (
          <Anchor questions={props.questions} key={index} anchorId={node.attribs.anchorid}>
            {React.createElement(node.tagName, node.attribs, children)}
          </Anchor>
        );
      },
    },
    {
      shouldProcessNode: function (node) {
        return true;
      },
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ];

  // var reactElement = parser.parse(props.body);
  const reactElement = parser.parseWithInstructions(props.body, ()=>true, processingInstructions, []);

  return (
    <div {...props} style={{border: "1px solid gray",
    borderRadius: "5px", backgroundColor: "white", padding: "10px"}}>{reactElement}</div>
  )
}

const drawerWidth = 320;

const styles = (theme) => ({
  assignment: {
    width: `calc(100% - ${drawerWidth}px)`,
    padding: "10px",
    fontFamily: "Roboto, sans-serif"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: theme.zIndex.drawer,
    overflowY: "hidden"
  },
  drawerPaper: {
    width: drawerWidth,
  },
  title: {
    fontFamily: "Cairo, sans-serif",
  },
  pageTitle: {
    fontFamily: "Cairo, sans-serif",
    display: "block",
    minHeight: "90px",
    padding: "20px 0 "
  },
  questionTitle: {
    height: "8vh"
  },
  questions: {
    height: "62vh",
    overflowX: "hidden",
    overflowY: "auto",
    padding: theme.spacing(1)
  },
  questionsTeacher: {
    height: "86vh",
    overflowX: "hidden",
    overflowY: "auto",
    padding: theme.spacing(1)
  },
  newQuestionBox: {
    height: "26vh",
    width: "100%",
    padding: "5px",
    marginBottom: "0",
    backgroundColor: "white",
  },
  newQuestionTextBox: {
    width: "100%"
  },
  submitButton: {
    marginTop: "5px"
  },
  backCard: {
    height: "45px", 
    width: "100%",
    border: "1px gray solid",
    backgroundColor: "white",
    padding: "10px",
    fontSize: "120%",
    fontFamily: "Cairo, sans-serif"
  }
})

class AssignmentView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newQuestion: "",
      hideNewQuestion: false,
      anonymous: false,
      submitButtonEnabled: false,
      assignments: [],
      questions: {},
      assignmentId: -1
    };

    this.handleNewQuestionChange = this.handleNewQuestionChange.bind(this);
    this.handleNewQuestionSubmit = this.handleNewQuestionSubmit.bind(this);
    this.submitTeacherAnswer = this.submitTeacherAnswer.bind(this);
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
    // console.log(this.state.newQuestion);
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

  componentDidMount() {
    console.log("AssignmentView componentDidMount")
    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;

    this.props.getQuestions(courseId, assignmentId).then((questions) => {
      this.setState({questions});
    }).catch(error => {
      console.log(error);
    });
  }

  async submitTeacherAnswer(questionId, answerBody) {
    console.log("AssignmentView submitTeacherQuestion");
    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;

    try {
      const success = await this.props.submitTeacherAnswer(courseId, assignmentId, questionId, answerBody);

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

  async deleteQuestion(questionId, hide) {
    console.log("AssignmentView deleteQuestion");
    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;

    try {
      const success = await this.props.deleteQuestion(courseId, assignmentId, questionId, hide);

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

  render () {
    const courseId = this.props.match.params.courseId;
    const assignmentId = this.props.match.params.assignmentId;
    const {classes} = this.props;

    //const assignment = this.state.assignments[assignmentId];
    const assignment = this.props.assignments[assignmentId];
    if (assignment === undefined || this.state.questions === {} || !("generalQuestions" in this.state.questions) || !("anchoredQuestions" in this.state.questions)) {
      return (
        <h2>
          Loading...
        </h2>
      )
    }

    const anchors = assignment.questionAnchors;

    const AnchoredQList = (props) => {
      let { anchorId } = useParams();
      return (
        <div>
          <div className={classes.questionTitle}>
            <Typography variant="h6" className={classes.title}>
                <u>{anchors[anchorId]} Questions</u>
              </Typography>
            </div>

            <div className={props.user.type !== 0 ? classes.questions: classes.questionsTeacher}>
            {
              this.state.questions.anchoredQuestions[anchorId].map((question, id) => (
                <QuestionCard 
                  key={id} 
                  question={question} 
                  user={this.props.user} 
                  submitTeacherAnswer={answer => this.submitTeacherAnswer(question._id, answer)}
                  deleteQuestion={hide => this.deleteQuestion(question._id, hide)}
                />
              ))
            }
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className={classes.assignment}>
          <Card className={classes.backCard}>
            <Link to={`/courses/${courseId}`}>
              ← Back to Course
            </Link>
          </Card>

          <Typography variant="h3" className={classes.pageTitle}>
            {assignment.name}
          </Typography>
          <Divider/>

          <Anchor questions={this.state.questions} anchorId={-1}>
            <h2 className={classes.title}>General Questions</h2>
          </Anchor>
          
          <AssignmentBody questions={this.state.questions} match={this.props.match} body={assignment.body}/>
        </div>

        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="right"
          >
            <div style={{padding: "10px"}}>
              <Switch>
                <Route exact path={this.props.match.path}>
                  <div className={classes.questionTitle}>
                    <Typography variant="h6" className={classes.title}>
                      <u>General Questions</u>
                    </Typography>
                  </div>

                  <div className={this.props.user.type !== 0 ? classes.questions: classes.questionsTeacher}>
                  {
                    this.state.questions.generalQuestions.map((question, id) => (
                      <QuestionCard 
                        submitTeacherAnswer={answer => this.submitTeacherAnswer(question._id, answer)} 
                        key={id} 
                        question={question} 
                        user={this.props.user}/>
                    ))
                  }
                  </div>
                </Route>
                  <Route path={`${this.props.match.path}/anchors/:anchorId`}>
                    <AnchoredQList user={this.props.user}/>
                </Route>
              </Switch>

              {
                this.props.user.type !== 0 ?
                (<div className={classes.newQuestionBox}>
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
                        onChange={this.handleHideNewQuestionChange.bind(this)}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Instructor-Only"
                  />
                  <FormControlLabel
                    style={{
                      fontSize: "50%"
                    }}
                    control={
                      <Checkbox
                        checked={this.state.anonymous}
                        onChange={this.handleAnonymousChange.bind(this)}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Anonymous"
                  />

                  <Button disabled={!this.state.submitButtonEnabled} color="primary" className={classes.submitButton} fullWidth variant="contained" size="small" onClick={this.handleNewQuestionSubmit}>
                    Submit
                  </Button>
                </div>) : <></>
              }
            </div>
          </Drawer>
      </div>
    );
  }
}

export default withStyles(styles)(AssignmentView);