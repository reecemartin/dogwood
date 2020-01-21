### The Project

Dogwood is an extension for the Canvas LMS (Quercus at the University of Toronto) intended for use creating documents and assignment descriptions which can act as public boards where comments, questions, and updates can be directly posted.

## The Problem

Currently when questions come up for many Computer Science Assignments at the University of Toronto, students are directed to a message board. The message board which may be from a number of providers (leading to potential privacy concerns etc.) is an improvement and optimization of the traditional process of asking questions in office hours or via email, in that students can answer each others questions and professors can more easily send students to answers that already satisfy their questions.

Unfortunately, while the answer boards do help with reducing the number of repeat questions, and answers which need to be provided they create another problem in that they centralize and combine a massive volume of questions, many of which are related to one another. Furthermore, when assignments come due a blitz of activity can make finding relevant information or corrections difficult. These are some of the core issues Dogwood aims to resolve.

## The Solution

Our proposed solution is Dogwood, a progressive web app which allows instructors to import assignment documentation as well as other course materials (assignments are a current priority). Once an assignment is uploaded a number of new functionalities are enabled over what is provided through traditional solutions.

# Inline Annotations - Comments and Questions

1) Commenting: Students and Professors can comment on sections of the assignment with helpful thoughts and the like. Other students as well as course teams can vote or highlight comments which are of high quality with a system similar to Reddit. Users who receive upvotes for their comments receive some form of reward.

2) Questions: Students can ask questions about particular parts of the assignment directly on the assignment posting which enables quick lookup of related inquiries from other students. The point system described in 1) also works for questions.

# Clarifications

With the incredible complexity of assignments provided to students in Computer Science it is common for new assignments or even battle tested ones to feature typos or unclear tasks. All Dogwood users have the ability to propose changes and clarifications to the professor with successful positive contributions rewarded with a healthy serving of points. Through this process Dogwood enables course teams to use large student populations to improve assignments for one another while reducing the need for clarifications.

In addition a common issue faced with the way clarifications are traditionally done (as a message board post, potentially pinned) Dogwood automatically notifies students of major clarifications when they open the assignment, ensuring everyone is on the same page. 

# Other Functionality

- Import and Export of Assignments
- Muting of Users
- At least 3 Levels of Permissions
- Inline Editing
- UI Features Described in the following section

# User Experience

# Technology Stack

Our initial proposal is to build the Dogwood application as a ReactJS Webpage with a NodeJS/ExpressJS Backend and MongoDb used for Storage of Assignments, and other miscellaneous user data such as permissions. Login and Authentication will be handled via UofT's Quercus LMS Software with Users automatically logged in and authenticated when redirected to Dogwood from Quercus. (Based on the LTI Functionality Described here: https://www.eduappcenter.com/docs/basics/index). We like this tech stack and approach as it will enable fast development and the usage of numerous UI libraries and frameworks to create a visually appealing application.