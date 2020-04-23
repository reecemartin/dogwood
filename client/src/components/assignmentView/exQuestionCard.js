import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography"
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Collapse from "@material-ui/core/Collapse";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  card: {
    width: "100%",
    padding: "5px",
    minHeight: "50px",
    marginBottom: "10px",
    border: "1px solid white",
    '&:hover': {
      border: "1px solid gray",
      cursor: "pointer"
    },
  },
  cardExpanded: {
    width: "100%",
    padding: "5px",
    minHeight: "50px",
    marginBottom: "10px",
    border: "1px solid gray",
  },
  container: {
    width: "100%",
    minHeight: "100%"
  },
  subtitle: {
    color: "lightgray",
    fontSize: "80%",
    margin: "2px 0"
  },
  username: {
    color: "gray"
  },
  content: {
    fontSize: "110%",
    minHeight: "40px",
    wordWrap: "normal"
  },
  voteContainer: {
    height: "80px"
  },
  questionContentContainer: {
    minHeight: "80px",
    padding: "5px",
  },
  answerPreviewContainer: {
    height: "80px",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    border: "1px solid lightgrey",
    borderRadius: "5px",
    padding: "5px"
  },
  tabs: {
    width: '100px',
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    '& > div': {
      maxWidth: 75,
      width: '100%',
      color: "black",
      height: "50px"
    },
  },
  tab: {
    textTransform: 'none',
    minWidth: 72,
    marginRight: theme.spacing(4),
    marginBottom: '0',
    padding: "0"
  },
  answerPreviewBox: {
    height: "100px",
    width: "100%",
    padding: "2px"
  },
  addAnswerButton: {
    width: "auto",
    margin: "10px auto"
  },
  answerTextBox: {
    width: "100%"
  },
  submitButton: {
    marginTop: "5px"
  }
});

class ExQuestionCard extends React.Component {
  constructor(props) {
    super(props);
    const hasT = "teacherAnswer" in this.props.question;
    const hasS = "studentAnswer" in this.props.question;

    this.state = {
      expanded: false,
      curPreview: hasT ? 0 : (hasS ? 1 : 0),
      tExpanded : false,
      sExpanded : false,
      tSubmitEnabled : false,
      sSubmitEnabled : false,
      tAnswer : hasT ? this.props.question.teacherAnswer.content : "",
      sAnswer : hasS ? this.props.question.studentAnswer.content : ""
    };
    this.toggleCurPreview = this.toggleCurPreview.bind(this);
    this.toggleExpand = this.toggleExpand.bind(this);
    this.toggleSExpand = this.toggleSExpand.bind(this);
    this.toggleTExpand = this.toggleTExpand.bind(this);
    this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
    this.handleSAnswerChanged = this.handleSAnswerChanged.bind(this);
    this.handleTAnswerChanged = this.handleTAnswerChanged.bind(this);
  }

  toggleCurPreview(e, newValue) {
    e.preventDefault()
    console.log("togglecurpreview")
    this.setState({curPreview: newValue});
  }

  toggleExpand(expand) {
    if (!expand) 
      this.setState({expanded: expand, sExpanded: false, tExpanded: false})
    else
      this.setState({expanded:expand})
  }

  toggleSExpand(expand) {
    this.setState({sExpanded: expand});
  }
  toggleTExpand(expand) {
    this.setState({tExpanded: expand});
  }

  handleTAnswerChanged (event) {
    if (event.target.value !== "") {
      this.setState({tAnswer: event.target.value, tSubmitEnabled: true});
    } else {
      this.setState({tAnswer: event.target.value, tSubmitEnabled: false});
    }
  }

  handleSAnswerChanged (event) {
    if (event.target.value !== "") {
      this.setState({sAnswer: event.target.value, sSubmitEnabled: true});
    } else {
      this.setState({sAnswer: event.target.value, sSubmitEnabled: false});
    }
  }

  handleAnswerSubmit (teacher) {
    const answer = teacher ? this.state.tAnswer : this.state.sAnswer;
    console.log("save clicked! answer: " + answer);
    
    this.props.submitAnswer(answer).then((result) => {
      if (result) {
        console.log("question card: success");
        this.setState({expanded: false})
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  render () {
    const {classes} = this.props;
    // TODO: there must be a better way to present this. Hardcoded string length right now. 
    const shortContent = this.props.question.content.length > 100 ? this.props.question.content.substring(0, 95) + "..." : this.props.question.content;

    return (
      <ClickAwayListener onClickAway={e => this.toggleExpand(false)}>
      <Card className={!this.state.expanded? classes.card:classes.cardExpanded} raised={this.state.expanded}>
        <Grid container className={classes.container}>
          <Grid item xs={1} className={classes.voteContainer} onClick={e=>this.toggleExpand(true)}>
            0 Votes
          </Grid>
          <Grid item xs={6} className={classes.questionContentContainer} onClick={e=>this.toggleExpand(true)}>
            <Typography variant="body2" className={classes.subtitle}>
              <span className={classes.username}><b>{this.props.question.author.name}</b></span> asked: 
            </Typography>
            <Typography variant="body2" className={classes.content}>
              {
                this.state.expanded ? this.props.question.content : shortContent
              }
            </Typography>
          </Grid>
          {
              !this.state.expanded ? (
                <Grid item xs={5} className={classes.answerPreviewContainer}>
            {/* tabs to switch between student and instructor answer */}
                  <Tabs
                    orientation="vertical"
                    value={this.state.curPreview}
                    onChange={this.toggleCurPreview}
                    aria-label="answer preview tabs"
                    className={classes.tabs}
                  >
                    <Tab className={classes.tab} label="Instructor"/>
                    <Tab className={classes.tab} label="Student"/>
                  </Tabs>
                  <div onClick={e=>this.toggleExpand(true)}>
                    <div 
                      index={0}
                      hidden={this.state.curPreview !== 0}
                      className={classes.answerPreviewBox}
                      >
                        <Typography variant="body2" className={classes.subtitle}>
                          Instructor Answer: 
                        </Typography>
                        <Typography variant="body2" className={classes.content}>
                          {
                            this.props.question.teacherAnswer ? this.props.question.teacherAnswer.content: "No instructor answer yet."
                          }
                        </Typography>
                    </div>
                    <div
                      index={1}
                      hidden={this.state.curPreview !== 1}
                      className={classes.answerPreviewBox}
                      >
                        <Typography variant="body2" className={classes.subtitle}>
                          Student Answer: 
                        </Typography>
                        <Typography variant="body2" className={classes.content}>
                          {
                            this.props.question.studentAnswer ? this.props.question.studentAnswer.content : "No student answer yet."
                          }
                        </Typography>
                    </div>
                  </div>
                  </Grid>
              ):<></>
            }
            <Grid container item xs={12}>
              <Collapse in={this.state.expanded} unmountOnExit style={{width: "100%"}}>
                <Grid item xs={12} style={{justifyContent: "center", textAlign: 'center'}}>
                  <Divider variant="fullwidth"/>

                  {/* Student answer box */}
                  {
                    this.props.question.studentAnswer ? (
                      <div>
                        <Typography variant="body2" className={classes.subtitle}>
                          Student Answer: 
                        </Typography>
                        <Typography variant="body2" className={classes.content}>
                          {this.props.question.studentAnswer.content}
                        </Typography>
                      </div>
                    ):this.props.user.type !== 0 ? 
                      (this.state.sExpanded ? (
                        <div style={{padding: "5px"}}>
                          <TextField
                            id="answerTextField"
                            label="Add an Answer..."
                            multiline
                            rows="2"
                            variant="outlined"
                            className={classes.answerTextBox}
                            value={this.state.sAnswer}
                            onChange={this.handleSAnswerChanged}
                          />
                          <Button 
                            color="primary" 
                            className={classes.submitButton} 
                            fullWidth 
                            variant="contained" 
                            size="small"
                            onClick={e => this.handleAnswerSubmit(false)}
                            >
                            Save
                          </Button>
                        </div>
                      ) :
                    (
                      
                      <Button 
                        variant="contained" 
                        color="primary" 
                        className={classes.addAnswerButton}
                        onClick={e=>this.toggleSExpand(true)}
                        >
                        + Add Student Answer
                      </Button>
                    )):(
                      <Typography variant="body2" className={classes.content} style={{margin:"10px 0 0 0 "}}>
                        No student answer yet.
                      </Typography>
                    )
                  }
                </Grid>
                <Grid item xs="12" style={{justifyContent: "center", textAlign: 'center'}}>
                  <Divider variant="fullwidth"/>
                  {/* Instructor answer box */}
                  {
                    this.props.question.teacherAnswer ? (
                      <div>
                        <Typography variant="body2" className={classes.subtitle}>
                          Instructor Answer: 
                        </Typography>
                        <Typography variant="body2" className={classes.content}>
                          this.props.question.TeacherAnswer.content
                        </Typography>
                      </div>
                    ):this.props.user.type === 0 ?
                      (this.state.tExpanded ? (
                        <div style={{padding: "5px"}}>
                          <TextField
                            id="answerTextField"
                            label="Add an Answer..."
                            multiline
                            rows="2"
                            variant="outlined"
                            className={classes.answerTextBox}
                            value={this.state.tAnswer}
                            onChange={this.handleTAnswerChanged}
                          />
                          <Button 
                            color="primary" 
                            className={classes.submitButton} 
                            fullWidth 
                            variant="contained" 
                            size="small"
                            disabled={!this.state.tSubmitEnabled}
                            onClick={e => this.handleAnswerSubmit(true)}
                            >
                            Save
                          </Button>
                        </div>
                      ): (
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.addAnswerButton}
                          onClick={e=>this.toggleTExpand(true)}
                          >
                        + Add Instructor Answer
                      </Button>
                      )
                    ):(
                      <Typography variant="body2" className={classes.content} style={{margin:"10px 0 0 0 "}}>
                        No instructor answer yet.
                      </Typography>
                    )
                  }
                </Grid>
              </Collapse>
           </Grid>
        </Grid>
      </Card>
      </ClickAwayListener>
    )
  }
}

export default withStyles(styles)(ExQuestionCard);