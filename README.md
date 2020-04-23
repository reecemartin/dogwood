# dogwood
A project for creating enhanced interactive assignments with Canvas. Named after the provincial flower of British Columbia.

The project is developed with the MERN (Mongo Express React Node) stack. 

## Project Motivation

Many students and teachers have probably faced this exact scenario: An assignment's description is confusing, so students flock to the course's discussion boards to ask questions about it. However, a regular discussion board's structure is linear, and when they get long, questions that have already been asked about the confusing sections and replies are easily missed, and more questions get asked about the same thing, causing confusion and extra work for instructor's to answer them. The problem: questions aren't clearly associated with specific parts of an assignment, and they aren't displayed in a logical order or way that allow for easy retrieval of information. 

## Goal

Dogwood aims to solve this problem that exist in traditional forum-style discussion boards by integrating a Q&A interface directly inside an assignment, giving students the ability to ask question about a specific part of an assignment, and display them in a way that is intuitive for other students to find the answer that they are looking for. Dogwood is designed to be a Canvas LMS (https://www.instructure.com/canvas/) plug-in that can be embedded into a Canvas course in place of the built-in "Assignments" page, or it can be used as a standalone site after Canvas assignment information has been retrieved. 

## Initial Planning

### The Design

The design and look of Dogwood is inspired by its predecessors: Piazza and Canvas's own discussion board. We wanted to incorporate what already works with these two products into what we thought they lacked: the context of the assignment description itself. As we envisioned this to be the entrypoint for a student into their assignment, we wanted the assignment description itself to take the center stage, and the discussion itself to take a supporting role, which is how we came to the initial design of having the description take up about 70% of the screen space, while questions and answers are shown in a sidebar on the right hand side. 

### Anchored Questions

A large part of our project revolves around the concept of an "anchored question": a question that has an anchor point. These anchor points are envisioned to be either a section, or a specific point in the text that needs more explanation. Due to concerns with the technical complexity, we started with working only with predetermined anchors: the instructor dictates which pieces of text are important enough to become an anchor, through the use of HTML tags; the software, on initial setup of the assignment, then scans the assignment text for these specified HTML tags and assigns an anchor to them, at which the students are then able to ask questions. 

### Q & A

We felt that Piazza's discussion board system (https://piazza.com/) is very well developed and had all the features that we loved, so we decided to implement similar features in Dogwood, while further improving on them. The features we thought were necessary to port to Dogwood include: anonymous questions, private (instructor-only) questions, comments, student-contributed answers, and a powerful rich text editor for text entry into Dogwood. Besides these features, some other features we think would be helpful to add to Dogwood in the future include

* A voting system to help instructors answer the most important questions first somewhat liek how Reddit operates
* Reddit-esque threads for comments in a question.
* More robust anchoring systems
* Mobile Device Support and Optimization
* Integration with more LMS Software


## Feature Progression

### First Prototype (End of February 2020)

The first prototype we developed was focused on the concept of anchors: We wanted to ensure that the most important part of dogwood -- being able to anchor questions to a specific anchor and browse questions only pertaining to a certain anchor -- is implemented first, so we can see whether our idea would actually be worthwhile to implement at all. For this milestone, we implemented:

* Importing of assignments from Canvas/Quercus (U of T's Canvas instance)
* Processing of assignments to extract anchor points
* Adding questions to an anchor
* Addding an instructor answer to a question
* Displaying an assignment with questions in a sidebar
* Displaying anchored questions when an anchor is clicked

### Second Prototype (Mid-March 2020)

Our second milestone built upon what we implemented for the first phase, and we implemented a few more features that we deemed essential for dogwood, with the primary focus being on more Q&A functionalities and better presentation of information. The features we implemented include:

* A course page that lists out all the assignments categorized by due dates
* A new question preview box that shows up when an anchor is hovered over, showing the number of questions in total, number of unanswered questions, and the top unanswered/overall question for the anchor
* Ability to ask a private/instructor-only question that is hidden from other students, the question will show as red in the question list
* Ability to edit an answer after it's saved

## Current Status

We are currently working to improve the Q&A interface further, and to expand on the functionality of anchors. 

* Currently, the Q&A interface exists solely in a small sidebar. We feel that there isn't enough room to realize the extensive Q&A functionalities that we plan to implement into dogwood, and that it isn't the best way to present this information, so we are currently designing an alternate layout for dogwood's assignments: A fully-flexible sidebar that can expand to take up up to 70% of the space on the page, while still having the assignment on the left hand side to give users context, which, to us, is the most important part of dogwood. 
* We have yet to implement all the Q&A functionalities that we planned to include in dogwood yet, so we are working to implement those as well. The Q&A features we are currently working on include:
  - Student answers
  - Anonymous questions

## Future Plans

We have a laundry list of features that we feel would be great to include in dogwood, and we will hopefully be able to get to them in the future. These are ranked by priority/importance, but not necessarily in the order we will implement them, depending on the circumstances.

* Implement OAuth. This is a really big aspect of the project that will take it beyond a prototype/MVP and elevate it into a product that can actually be used by a school. Currently, there is only one user account connected to the project using a manually-generated API token, which means that it doesn't support multiple users just yet, and won't work out of the box for any other user. In order to do so, we need to retrieve the developer token from the Quercus administrators, and in it's current state, we just don't think dogwood is ready for that yet. We plan to develop the project further and prove that it is a valuable project before we connect it to Quercus. 

## How to start the development server

1. Install NodeJS and NPM
2. Clone this project
3. In a terminal, navigate to the root folder of the project repository
4. Run `npm install`
5. Navigate into the client folder
6. Run `npm install`
7. Navigate back to the root folder
6. Run `npm run dev`

Congrats! Now the development server is running, with the front end React app running on Port 3000, and the back end Express app running on Port 4000.
