import React from 'react';
import Card from '@material-ui/core/Card'
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
    backgroundColor: "white",
    minHeight: "150px",
    width: "300px",
    padding: "10px",
    fontFamily: "Cairo, sans-serif"
  },
  subtitle: {
    color: "gray",
    fontSize: "80%",
    margin: "2px 0"
  }
}

const AnchorPreview = (props) => {
  const {classes} = props;
  const unanswered = props.questions.filter(item => !item.answer).sort((a, b) => a.publishedDate - b.publishedDate);
  const questions = props.questions.sort((a, b) => a.publishedDate - b.publishedDate);
  return (
    <Card className={classes.card}>
      <Grid container direction="row">
        <Grid container item xs={4} alignContent="center">
          <Grid container item xs={12}>
            <Grid item xs={6} style={{justifyContent: "center"}}>
              <HelpOutlineIcon fontSize="large" color="error" display="block"/>
              <Typography align="right">
                NEW
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" align="left">
                {unanswered.length}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <HelpOutlineIcon fontSize="large" color="primary"/>
              <Typography align="right">
                ALL
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6" align="left">
                {props.questions.length}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container item xs={8} alignContent="center" style={{height: "100%"}}>
          {
            unanswered.length !== 0? (
              <Grid item xs={12} style={{height: "75px"}}>
                <Typography variant="body2" className={classes.subtitle}>
                  Top Unanswered Question: 
                </Typography>
                <Typography variant="body1">
                  {unanswered[0].content} 
                </Typography>
              </Grid>
            ) : <></>
          }
          {
            props.questions.length !== 0? (
              <Grid item xs={12} style={{height: "75px"}}>
                <Typography variant="body2" className={classes.subtitle}>
                  Top Question Overall: 
                </Typography>
                <Typography variant="body1">
                  {questions[0].content}   
                </Typography>
              </Grid>
            ) : <></>
          }
        </Grid>
      </Grid>
    </Card>
  );
}

export default withStyles(styles)(AnchorPreview);