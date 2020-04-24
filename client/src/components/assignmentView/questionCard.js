import React from "react";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Collapse from '@material-ui/core/Collapse';
import CardContent from '@material-ui/core/CardContent';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Grow from "@material-ui/core/Grow";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ReplyIcon from '@material-ui/icons/Reply';
import EditIcon from '@material-ui/icons/Edit';

const hiddenColor = "#ffcccc";

const styles = theme => ({
  card: {
    padding: "5px",
    marginBottom: "10px"
  },
  hiddenCard: {
    padding: "5px",
    marginBottom: "10px",
    backgroundColor: hiddenColor
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
    fontSize: "100%",
    minHeight: "40px",
  },
  shortContent: {
    fontSize: "100%"
  },
  answerTextBox: {
    width: "100%"
  },
  submitButton: {
    marginTop: "5px"
  },
  divider: {
    margin: "5px 0"
  },
  floatingButtons: {
    position: "absolute",
    top: "2px",
    right: "2px",
    backgroundColor: "white"
  },
  hiddenButtons: {
    position: "absolute",
    top: "2px",
    right: "2px",
    backgroundColor: hiddenColor
  },
  container: {
    position: "relative"
  },
  menuButton: {
    display: "block"
  }, 
  replyButton: {
    display: "block"
  },
  editButton: {
    position: "absolute",
    top: "2px",
    right: "2px",
    backgroundColor: "white"
  },
  hiddenEditButton: {
    position: "absolute",
    top: "2px",
    right: "2px",
    backgroundColor: hiddenColor
  },
  answerBox: {
    position: "relative"
  }
})

class QuestionCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {expanded: false, answer: "", submitButtonEnabled: false, showMenu: false, anchorEl: null, showEdit: false}
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAnswerChanged = this.handleAnswerChanged.bind(this);
    this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleOpen (event) {
    const isTeacher = this.props.user.type === 0;
    const tAnswer = this.props.question.teacherAnswer;
    const sAnswer = this.props.question.studentAnswer;
    this.setState({
      expanded: true, 
      answer: (isTeacher && tAnswer) ? tAnswer.content : ((!isTeacher && sAnswer) ? sAnswer.content : "")
    })
  }

  handleClose (event) {
    this.setState({expanded: false});
  }

  handleAnswerChanged (event) {
    if (event.target.value !== "") {
      this.setState({answer: event.target.value, submitButtonEnabled: true});
    } else {
      this.setState({answer: event.target.value, submitButtonEnabled: false});
    }
  }

  handleAnswerSubmit () {
    const answer = this.state.answer;
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

  handleMouseEnter (question) {
    if (question) {
      this.setState({showMenu: true});
    } else {
      this.setState({showEdit: true});
    }
  }

  handleMouseLeave (question) {
    if (question) {
      this.setState({showMenu: false});
    } else {
      this.setState({showEdit: false});
    }
  }

  handleMenuClick(event) {
    this.setState({anchorEl: event.currentTarget});
  };

  handleMenuClose(e) {
    e.preventDefault();
    this.setState({anchorEl: null});

    if (e.currentTarget.id === "hideButton") {
      console.log("hide button clicked");

      this.props.deleteQuestion(true).then((result) => {
        if (result) {
          console.log("question hidden");
        }
      }).catch((error) => {
        console.log(error);
      });
    }
  };

  render () {
    const {classes} = this.props;
    console.log(this.props.question.hidden)
    const isTeacher = this.props.user.type === 0;
    const tAnswer = this.props.question.teacherAnswer;
    const sAnswer = this.props.question.studentAnswer;

    return (
      <ClickAwayListener onClickAway={this.handleClose}>
      <div className={classes.container}>
        <Card className={this.props.question.hidden ? classes.hiddenCard : classes.card} raised id="answerCard">
        <div onMouseEnter={() => this.handleMouseEnter(true)} onMouseLeave={() => this.handleMouseLeave(true)}>
          {/* question content */}
          <div>
            <Typography variant="body2" className={classes.subtitle}>
              <span className={classes.username}><b>{this.props.question.author.name}</b></span> asked: 
            </Typography>
            <Typography variant="body2" className={this.props.question.answer? classes.shortContent : classes.content}>
              {this.props.question.content}
            </Typography>
          </div>

          {/* more menu */}
          <div>
          <Grow in={this.state.showMenu} className={this.props.question.hidden ? classes.hiddenButtons: classes.floatingButtons} >
              {/* more menu button */}
              
              <div>
              {
                this.props.user.type === 0 ? (
                  <IconButton className={classes.menuButton} size="small" onClick={this.handleMenuClick}>
                    <MoreVertIcon/>
                  </IconButton>
                ) : <></>
              }

              {
                (((isTeacher && !tAnswer) || (!isTeacher && !sAnswer)) && !this.state.expanded) ? (
                  <IconButton className={classes.replyButton} size="small" id="replyButton" onClick={this.handleOpen}>
                    <ReplyIcon/>
                  </IconButton>
                ): <></>
              }
              </div>
            </Grow>
          
            {
              this.props.user.type === 0 ? (
                <div>
                {/* more menu */}
                <Menu 
                  id="simple-menu"
                  anchorEl={this.state.anchorEl}
                  keepMounted
                  open={Boolean(this.state.anchorEl)}
                  onClose={this.handleMenuClose}
                  >
                  {
                    this.props.question.hidden ? (
                      <MenuItem ><span style={{color: "gray"}}>*question hidden*</span></MenuItem>
                    ):(
                      <MenuItem id="hideButton" onClick={this.handleMenuClose}>Hide</MenuItem>
                    )
                  }
                  </Menu>
                </div>
              ): <></>
            }
          </div>

          {/* student answer */}
          {
            !this.props.question.studentAnswer ? (
              <></>
            ):(
              <div className={classes.answerBox} onMouseEnter={() => this.handleMouseEnter(false)} onMouseLeave={() => this.handleMouseLeave(false)}>
                <Divider className={classes.divider}/>
                <Typography variant="body2" className={classes.subtitle}>
                  Student Answer: 
                </Typography>
                <Typography variant="body2">
                  <strong>{this.props.question.studentAnswer.content}</strong>
                </Typography>

                {/* edit button */}
                {
                  this.props.user.type !== 0 ? (
                    <Grow in={this.state.showEdit && !this.state.expanded}>
                      <IconButton className={this.props.question.hidden ? classes.hiddenEditButton : classes.editButton} size="small" onClick={this.handleOpen}>
                        <EditIcon size="small"/>
                      </IconButton>
                    </Grow>
                  ):<></>
                }
              </div>
            )
          }

          {/* teacher answer */}
          {
            !this.props.question.teacherAnswer ? (
              <></>
            ):(
              <div className={classes.answerBox} onMouseEnter={() => this.handleMouseEnter(false)} onMouseLeave={() => this.handleMouseLeave(false)}>
                <Divider className={classes.divider}/>
                <Typography variant="body2" className={classes.subtitle}>
                  Instructor Answer: 
                </Typography>
                <Typography variant="body2">
                  <strong>{this.props.question.teacherAnswer.content}</strong>
                </Typography>

                {/* edit button */}
                {
                  this.props.user.type === 0 ? (
                    <Grow in={this.state.showEdit && !this.state.expanded}>
                      <IconButton className={this.props.question.hidden ? classes.hiddenEditButton : classes.editButton} size="small" onClick={this.handleOpen}>
                        <EditIcon size="small"/>
                      </IconButton>
                    </Grow>
                  ):<></>
                }
              </div>
            )
          }

          {/* edit answer box */}
          <Collapse in={this.state.expanded} unmountOnExit>
            <CardContent>
              <TextField
                id="answerTextField"
                label="Add an Answer..."
                multiline
                rows="2"
                variant="outlined"
                className={classes.answerTextBox}
                value={this.state.answer} 
                onChange={this.handleAnswerChanged}
              />
              <Button 
                disabled={!this.state.submitButtonEnabled} 
                color="primary" 
                className={classes.submitButton} 
                fullWidth 
                variant="contained" 
                size="small" 
                onClick={this.handleAnswerSubmit}>
                Save
              </Button>
            </CardContent>
          </Collapse>
        </div>
      </Card>
      </div>
      </ClickAwayListener>
    )
  }
}

export default withStyles(styles)(QuestionCard);