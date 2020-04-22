import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography"

const styles = theme => ({
  card: {
    width: "100%",
    padding: "5px",
    minHeight: "50px",
    marginBottom: "10px"
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
    fontSize: "125%",
    minHeight: "40px",
  },
  voteContainer: {
    height: "80px",
    backgroundColor: "blue"
  },
  questionContentContainer: {
    minHeight: "80px",
    backgroundColor: "red",
    padding: "5px"
  },
  answerPreviewContainer: {
    height: "80px",
    backgroundColor: "blue"
  }
});

class ExQuestionCard extends React.Component {
  render () {
    const {classes} = this.props;
    return (
      <Card className={classes.card}>
        <Grid container className={classes.container}>
          <Grid item xs="1" className={classes.voteContainer}>
            hello?
          </Grid>
          <Grid item xs="6" className={classes.questionContentContainer}>
            <Typography variant="body2" className={classes.subtitle}>
              <span className={classes.username}><b>{this.props.question.author.name}</b></span> asked: 
            </Typography>
            <Typography variant="body2" className={classes.content}>
              {this.props.question.content}
            </Typography>
          </Grid>
          <Grid item xs="5" className={classes.answerPreviewContainer}>
            answer preview
          </Grid>
        </Grid>
      </Card>
    )
  }
}

export default withStyles(styles)(ExQuestionCard);