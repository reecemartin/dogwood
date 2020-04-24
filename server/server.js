const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db/mongoose');
const path = require('path');
const fetch = require('node-fetch');
const {Course} = require("./models/course");
const {Assignment} = require("./models/assignment");
const {User} = require("./models/user");
const {Question} = require("./models/question");
const {Answer} = require("./models/answer");

const app = express();
const PORT = process.env.PORT || 4000;
const log = console.log;

// Express Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, '../client/build')));

// Connect to Mongoose
const connection = mongoose.connection;
connection.once('open', () => {
  log("MongoDB database connection established successfully");
})

app.get('/', (req, res) => res.send('Hello World!'));

// Temporary Authorization Bearer Token
var myHeaders = new fetch.Headers();
myHeaders.append("Authorization", "Bearer 11834~JzaSLxVoP5PqHzaW39OugNAfWOHJmZ91a884db7YlVRTA52HZF3UDqMQnBL4jaLj");

// Get user information from a request
// Helper function so it's easier to test without using OAuth
const getUserInfoFromReq = (req) => {
  // Currently: get user & user type from req body
  return req.body.user; // contains userId, type
  // type = {0: teacher, 1: student, 2: other}
}

// Admin routes

// get all users
// GET '/api/users"
app.get('/api/users', (req, res) => {
  log("GET /api/users");
  User.find((err, users) => {
    if (err) {
      res.status(404).send(err);
      log(err);
    } else {
      res.json(users);
    }
  })
})

// get all courses
app.get('/api/courses', (req, res) => {
  log("GET /api/courses");
  Course.find((err, courses) => {
    if (err) {
      res.status(404).send(err);
      log(err);
    } else {
      res.json(courses);
    }
  })
})

// get all assignments
app.get('/api/assignments', (req, res) => {
  log("GET /api/assignments");
  Assignment.find((err, assignments) => {
    if (err) {
      res.status(404).send(err);
      log(err);
    } else {
      res.json(assignments);
    }
  })
})

// get info on a course
app.get('/api/courses/:id', async (req, res) => {
  const courseId = req.params.id;
  log(`GET /api/courses/${courseId}`);
  
  // find course
  try {
    const course = await Course.findByCourseId(courseId);
    //log(course);
    if (!course) {
      res.status(404).send("course not found");
      return;
    }

    res.send(course);
  } catch (error) {
    log(error);
    res.status(500).send(error);
  }
})

// get all assignment ids for a course
app.get('/api/courses/:id/assignments', async (req, res) => {
  const courseId = req.params.id;
  log("GET /api/courses/" + courseId + "/assignments");
  
  // find course
  try {
    const course = await Course.findByCourseId(courseId);
    // log(course);
    if (!course) {
      res.status(404).send("course not found");
      return;
    }
    res.send(course.assignments)
  } catch (error) {
    log(error);
    res.status(500).send(error);
  }
})

app.get('/api/courses/:id/assignments/:assignmentId', async (req, res) => {
  const courseId = Number(req.params.id);
  const assignmentId = Number(req.params.assignmentId);
  log("GET /api/courses/" + courseId + "/assignments/" + assignmentId);

  // find course
  try {
    const course = await Course.findByCourseId(courseId);

    //log(course);
    if (!course) {
      res.status(404).send("course not found");
      return;
    }

    // ensure assignment is in course
    if (course.assignments.includes(assignmentId)) {
      // find assignment in system
      const assignment = await Assignment.findByAssignmentId(assignmentId);

      //log(assignment);
      if (!assignment) {
        res.status(404).send();
        return;
      }
      res.send(assignment);
    }
  } catch (error) {
    log(error);
    res.status(500).send(error);
  }
})

// get all questions for an assignment
// return structure: {anchoredQuestions: [[q1], [q2, q3]], generalQuestions: [q4]}
app.get('/api/courses/:courseId/assignments/:assignmentId/questions', async (req, res) => {
  log("GET /api/course/:courseId/assignment/:assignmentId/questions");
  const courseId = req.params.courseId;
  const assignmentId = req.params.assignmentId;

  try {
    // find course
    const course = await Course.findByCourseId(courseId);
    if (!course) {
      res.status(404).send("Course not found");
      return;
    }
    log("course found");

    // find assignment
    const assignment = await Assignment.findByAssignmentId(assignmentId);
    if (!assignment) {
      res.status(404).send("Assignment not found");
      return;
    }
    log("assignment found");

    const generalQuestions = [];
    const anchoredQuestions = [];
    const questions = {generalQuestions: generalQuestions, anchoredQuestions: anchoredQuestions};
    
    // collect general questions
    for (let i in assignment.generalQuestions) {
      const questionId = assignment.generalQuestions[i];
      const questionObj = await Question.findById(questionId);
      if (questionObj === null) {
        res.status(500).send("cannot find question");
        return;
      }
      const question = questionObj.toObject();
      //log(question)
      if (question.teacherAnswer) {
        // get teacher answer
        const answerObj = await Answer.findById(questionObj.teacherAnswer);
        if (answerObj === null) {
          res.status(500).send("cannot find answer");
          return;
        }
        question.teacherAnswer = answerObj.toObject();
      }
      if (question.studentAnswer) {
        // get answer
        const answerObj = await Answer.findById(questionObj.studentAnswer);
        if (answerObj === null) {
          res.status(500).send("cannot find answer");
          return;
        }
        question.studentAnswer = answerObj.toObject();
      }
      // get username of asker
      const user = await User.findByUserId(questionObj.author);

      if (!user) {
        res.status(400).send("User doesn't exist");
        return;
      }

      //log(user);

      question.author = user.toObject();

      generalQuestions.push(question);
    }

    // collect anchored questions
    for (let anchor in assignment.questions) {
      const anchorQuestions = assignment.questions[anchor];
      anchoredQuestions.push([]);
      for (let i in anchorQuestions) {
        const questionId = anchorQuestions[i];
        const questionObj = await Question.findById(questionId);
        if (questionObj === null) {
          res.status(500).send("cannot find question");
          return;
        }
        const question = questionObj.toObject();
        //log(question)
        if (question.answer) {
          // get answer
          const answerObj = await Answer.findById(questionObj.answer);
          if (answerObj === null) {
            res.status(500).send("cannot find answer");
            return;
          }
          question.answer = answerObj.toObject();
        }
        // get username of asker
        const user = await User.findByUserId(questionObj.author);

        if (!user) {
          res.status(400).send("User doesn't exist");
          return;
        }

        //log(user);

        question.author = user.toObject();

        anchoredQuestions[anchor].push(question);
      }
    }

    // return questions
    res.send(questions);
  } catch (error) {
    log(error);
    res.status(500).send(error);
  }
}) 

// Functional routes

// add user: add user to database
// userId: 77126
const addUser = async (userId, name) => {
  log("addUser()");
  log("id: " + userId + " name: " + name);
  const user = new User({
    userId: userId,
    name: name,
    coursesTeaching: [],
    coursesStudying: []
  });

  try {
    const result = await user.save();
    return result;
  } catch (error) {
    log(error);
    return null;
  }
}

// POST '/api/users'
// {userId (canvasId), name}
app.post('/api/users', async (req, res) => {
  log("POST /api/users");
  log(req.body);

  if (!req.body.userId || !req.body.name) {
    res.status(400).send("canvas ID or name not in request body");
  }
  
  try {
    const user = await addUser(req.body.userId, req.body.name);
    if (user) 
      res.send(user);
    else
      res.status(500).send("Error saving user")
  } catch (error) {
    res.status(500).send(error);
  }
})

// Add user to a course
// POST '/api/course/courseId/users'
// {userId, type}
app.post('/api/courses/courseId/user', async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.body.userId;
  const type = req.body.type;

  if (type !== 0 || type !== 1) {
    res.status(400).send("Type is invalid");
    return;
  }

  try {
    // make sure user is in system
    const user = await User.findByUserId(userId);
    if (!user) {
      res.status(400).send("User doesn't exist");
      return;
    }

    // find course
    const course = await Course.findByCourseId(courseId);
    if (!course) {
      res.status(400).send("Course doesn't exist");
      return;
    }

    // make sure user isn't in the course already
    if (course.teachers.contains(userId) || course.students.contains(userId)) {
      res.status(400).send("User already in this course");
      return;
    }

    // add user to course
    if (type == 0) {
      course.teachers.push(userId);
      user.coursesTeaching.push(courseId);
    } else {
      course.students.push(userId);
      user.coursesStudying.push(courseId);
    }
    await course.save();
    await user.save();
    res.send(user);
  } catch (error) {
    log (error);
    res.status(500).send(error);
  }
})

// course setup: given a course, do initial setup for users
// Student: 133111
// teacher: 6119
// POST '/api/courses'
// {course id, user}
// make api call to fetch users and assignments
app.post("/api/courses/", async (req, res) => {
  // grab course id
  const courseId = req.body.courseId;

  // make api request for course info
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  
  try {
    // check whether course already exists in database
    const courseRes = await fetch('https://q.utoronto.ca/api/v1/courses/' + courseId, requestOptions);
    if (!courseRes.ok) {
      const err = courseRes.statusText;
      res.status(courseRes.status).send(err);
      return;
    }

    const courseJson = await courseRes.json();

    log("course doesn't exist in database");

    // user should already exist in the system
    const userInfo = getUserInfoFromReq(req);
    if (userInfo.type !== 0) {
      const err = "Only teachers can add class to database";
      res.status(400).send(err);
      return;
    }

    log("user is a teacher")

    // find user in the system
    const user = await User.findByUserId(userInfo.userId);
    if (!user) {
      res.status(400).send("User not found in database");
      return;
    }

    log("user exists in database")

    // add course to database
    const courseInfo = new Course({
      assignments: [],
      teachers: [user.userId],
      students: [],
      courseId: courseId,
      name: courseJson.name
    })

    const course = await courseInfo.save();

    log("course info saved");

    // find assignment info
    const assignmentsRes = await fetch('https://q.utoronto.ca/api/v1/courses/' + courseId + "/assignments", requestOptions);

    if (!assignmentsRes.ok) {
      const err = assignmentsRes.statusText;
      res.status(assignmentsRes.status).send(err);
      return;
    }

    // save each assignment
    const assignments = await assignmentsRes.json();
    log("assignments fetched, length: " + assignments.length);
    for (let aId in assignments) {
      const assignment = assignments[aId];
      const newAssignment = await addAssignment(course, assignment, user.userId);
      if (!newAssignment) {
        res.status(500).send("Cannot save assignment");
        return;
      }
      log("saved assignment");
    }

    log("all assignments processed")
    course.save();

    // save course to user as well
    user.coursesTeaching.push(courseId);
    user.save();
    log("course saved to user");

    res.send(course);
  } catch (error) {
    log(error);
    res.status(500).send(error);
  }
});


// assignment setup: given assignment id and body of assignment, parse (in a different file) into assignment objects and insert into database

// add assignment: given info, add assingment to database
const addAssignment = async (course, assignmentInfo, userId) => {
  log("addAssignment()");
  const body = assignmentInfo.description;

  // find anchors 
  const processed = findAnchorsInAssignment(body, "<h2>", "</h2>");
  const anchors = processed.anchors;
  const questions = [];
  for (let anchor in anchors) {
    //log(anchors[anchor]);
    questions.push([]);
  }

  const assignment = new Assignment({
    courseId: course.courseId,
    assignmentId: assignmentInfo.id,
    dueDate: assignmentInfo.due_at,
    publishedDate: assignmentInfo.unlock_at,
    creator: userId,
    moderators: [],
    students: [],
    generalQuestions: [],
    questionAnchors: anchors,
    questions: questions,
    name: assignmentInfo.name,
    body: processed.newBody
  });

  try {
    const assign = await assignment.save();
    course.assignments.push(assign.assignmentId);
    return assign;
  } catch (e) {
    log(e);
    return null;
  }
}

// add assignment by id: fetch assignment from canvas
const addAssignmentById = async (course, assignmentId, userId) => {
  log("addAssignmentById()");

  // make canvas api call
  const courseId = course.id;
  const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const canvasRes = await fetch('https://q.utoronto.ca/api/v1/courses/' + courseId + '/assignments/' + assignmentId, requestOptions);

    if (!canvasRes.ok) {
      const err = canvasRes.statusText;
      res.status(canvasRes.status).send(err);
      return null;
    }

    // add assignment to database
    const resBody = await canvasRes.json();
    const newAssignment = await addAssignment(course, resBody, userId);
    return newAssignment;
  } catch (error) {
    log (error);
    return null;
  }
}

// POST 'api/courses/:id/assignments'
// {assignment id}
app.post("/api/courses/:id/assignments", async (req, res) => {
  log("POST /api/courses/:id/assignments");
  const courseId = req.params.id;
  const assignmentId = req.body.assignmentId; 

  try {
    // check whether course is in database
    const course = await Course.findByCourseId(courseId);
    //log(course);

    if (course === null) {
      res.status(404).send("Course doesn't exist");
      return;
    }

    // check whether assignment is in database
    const assignment = await Assignment.findByAssignmentId(assignmentId);
    //log(assignment);
    if (assignment) {
      res.status(400).send("Assignment already exists");
    }
    
    // add assignment
    const result = await addAssignmentById(course, assignmentId, req.body.user.userId);

    if (result) {
      res.status(200).send();
    }
  } catch (error) {
    log(error);
    res.status(500).send(error);
  }

  res.status(500).send("server error occured")
});

// parsing: only parse <h3> tags into anchor locations. Generate anchor locations by going through and finding all the tags. 
// returns: {newBody, anchors}
const findAnchorsInAssignment = (body, openTag, closeTag) => {
  log("findAnchorsInAssignment()");
  // find anchors by tag and grab words in between
  const anchors = [];
  if (!body || body == "") return {newBody: body, anchors};

  const openTagClean = openTag.substring(0, openTag.length - 1);
  let idx = body.indexOf(openTagClean);
  let prevCloseIdx = 0;
  let newBody = "";

  while (idx != -1) {
    // add first bit of string to newBody
    if (prevCloseIdx === 0) {
      newBody += body.substring(0, idx);
    } else {
      newBody += body.substring(prevCloseIdx, idx);
    }

    // find anchor string
    const caret = body.indexOf(">", idx + 1);
    const closeIdx = body.indexOf(closeTag, caret);
    if (closeIdx == -1) {
      prevCloseIdx = caret + 1;
      break;
    }
    
    // add anchor to newBody
    const restOfTag = body.substring(idx + openTagClean.length, closeIdx + closeTag.length);
    //log("Rest of tag: " + restOfTag);
    newBody += openTagClean + " anchorId=" + anchors.length + " " + restOfTag;
    anchors.push(body.substring(caret + 1, closeIdx));

    // update indices
    prevCloseIdx = closeIdx + closeTag.length;
    idx = body.indexOf(openTagClean, idx + openTagClean.length);
  }

  // add the rest of the body to newBody
  if (newBody !== "")
    newBody += body.substring(prevCloseIdx);
  //log(newBody);

  // return them
  return {newBody, anchors};
};

// add question: given anchor id (which is just the index into the anchor list) and a question body, add into the list of questions
// POST "/api/course/courseId/assignment/assignmentId/questions"
// body: {questionBody, user, anchorId}
// if no anchorId, question will be added to general questions
app.post("/api/courses/:courseId/assignments/:assignmentId/questions", async (req, res) => {
  log("POST /api/course/:courseId/assignment/:assignmentId/questions");
  const courseId = req.params.courseId;
  const assignmentId = req.params.assignmentId;
  const userInfo = getUserInfoFromReq(req);
  const anchorId = req.body.anchorId;
  const questionBody = req.body.questionBody;
  const hidden = req.body.hidden;
  const anonymous = req.body.anonymous;
  
  // make sure input is good
  if (!questionBody || questionBody === "") {
    res.status(400).send("Invalid question body");
    return;
  }
  
  try {
    // find user
    const user = await User.findByUserId(userInfo.userId);
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    log("user found");

    // find course
    const course = await Course.findByCourseId(courseId);
    if (!course) {
      res.status(404).send("Course not found");
      return;
    }
    log("course found");

    // make sure user is in course
    if (!user.coursesStudying.includes(courseId) && !user.coursesTeaching.includes(courseId)) {
      res.status(400).send("User not enrolled in course");
      return;
    }
    log("user in course");

    // find assignment
    const assignment = await Assignment.findByAssignmentId(assignmentId);
    if (!assignment) {
      res.status(404).send("Assignment not found");
      return;
    }
    log("assignment found");

    // make sure anchor exists
    if (anchorId) {
      if (anchorId < 0 || anchorId >= assignment.questionAnchors.length) {
        res.status(400).send("Anchor not found");
        return;
      }
      //log (anchorId);
      log("anchor exists")
    }

    // make new question & save
    const questionInfo = new Question({
      publishedDate: new Date(),
      author: userInfo.userId,
      upvotes: 0,
      downvotes: 0,
      content: questionBody.trim(),
      hidden: hidden,
      anonymous: anonymous
    })
    
    const question = await questionInfo.save();
    log ("question saved")
    //log(question);
    //log(anchorId);

    // add question to assignment
    if ((anchorId || anchorId === 0) && anchorId !== -1) {
      assignment.questions[anchorId].push(question._id);
    } else {
      assignment.generalQuestions.push(question._id);
    }
    await assignment.save();
    log ("added to assignment");

    // return made question
    res.send(question);
  } catch (error) {
    log(error);
    res.status(500).send(error);
  }
});

app.delete("/api/courses/:courseId/assignments/:assignmentId/questions/:questionId", async (req, res) => {
  const courseId = req.params.courseId;
  const assignmentId = req.params.assignmentId;
  const questionId = req.params.questionId;
  const userInfo = getUserInfoFromReq(req);
  log(`/api/courses/${courseId}/assignments/${assignmentId}/questions/${questionId}`);

  try {
    // find user
    const user = await User.findByUserId(userInfo.userId);
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    log("user found");

    // find course
    const course = await Course.findByCourseId(courseId);
    if (!course) {
      res.status(404).send("Course not found");
      return;
    }
    log("course found");

    // make sure user is a teacher in course
    if (!user.coursesTeaching.includes(courseId) && !user.coursesStudying.includes(courseId)) {
      res.status(400).send("User not in course");
      return;
    }
    log("user in course");

    // find assignment
    const assignment = await Assignment.findByAssignmentId(assignmentId);
    if (!assignment) {
      res.status(404).send("Assignment not found");
      return;
    }
    log("assignment found");

    // find question
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).send("Question not found");
      return;
    }
    log("question found");

    // hide question if requested
    //log(req.body);
    if ("hide" in req.body && req.body.hide) {
      question.hidden = true;
      await question.save();
      res.send(question);
      return;
    }

    // if question has answer, first delete that
    if ("answer" in question) {
      // delete answer
      await Answer.findByIdAndDelete(question.answer);
    }
    const q = await Question.findByIdAndDelete(question);

    // delete reference to question in assignment
    let qid = assignment.generalQuestions.indexOf(questionId);
    if (qid !== -1) {
      assignment.generalQuestions.splice(qid, 1);
    } else {
      // find in anchored questions
      for (let i = 0; i < assignments.questions.length; i++) {
        qid = assignment.questions[i].indexOf(questionId);

        if (qid !== -1) {
          assignment.questions[i].splice(qid, 1);
          break;
        }
      }
    }
    await assignment.save();

    res.send(q);
  } catch (error) {
    log(error);
    res.status(500).send();
  }
});

// add answer: given question id, and question body, add answer to the question
// POST "/api/course/:courseId/assignment/:assignmentId/questions/:questionId/answer"
app.post("/api/courses/:courseId/assignments/:assignmentId/questions/:questionId/answer", async (req, res) => {
  log("POST /api/course/:courseId/assignment/:assignmentId/questions/:questionId/answer");
  const courseId = req.params.courseId;
  const assignmentId = req.params.assignmentId;
  const questionId = req.params.questionId;
  const userInfo = getUserInfoFromReq(req);
  const answerBody = req.body.answerBody;
  
  // make sure input is good
  if (!answerBody || answerBody === "") {
    res.status(400).send("Invalid question body");
    return;
  }
  
  try {
    // find user
    const user = await User.findByUserId(userInfo.userId);
    if (!user) {
      res.status(400).send("User not found");
      return;
    }
    log("user found");

    // find course
    const course = await Course.findByCourseId(courseId);
    if (!course) {
      res.status(404).send("Course not found");
      return;
    }
    log("course found");

    // make sure user is a teacher in course
    if (!user.coursesTeaching.includes(courseId)) {
      res.status(400).send("User not a teacher in course");
      return;
    }
    log("user in course");

    // find assignment
    const assignment = await Assignment.findByAssignmentId(assignmentId);
    if (!assignment) {
      res.status(404).send("Assignment not found");
      return;
    }
    log("assignment found");

    // find question
    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).send("Question not found");
      return;
    }
    log("question found");

    // make and save answer
    const answer = new Answer({
      publishedDate: new Date(),
      content: answerBody,
      author: userInfo.userId
    });
    await answer.save();
    //log(answer);

    // add answer to question
    if (userInfo.type === 0) {
      // add to teacher answer
      question.teacherAnswer = answer._id;
    } else {
      // add to student answer
      question.studentAnswer = answer._id;
    }
    await question.save();
    //log(question);
    res.send(answer);
  } catch (error) {
    log (error);
    res.status(500).send(error);
  }
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => console.log("Server is running on Port: " + PORT));