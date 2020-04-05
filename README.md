# dogwood
A project for creating enhanced interactive assignments with Canvas. Named after the provincial flower of British Columbia.

The project is developed with the MERN stack. 

## Project Motivation

Many students and teachers have probably faced this exact scenario: An assignment's description is confusing, so students flock to the course's discussion boards to ask questions about it. However, a regular discussion board's structure is linear, and when they get long, questions that have already been asked about the confusing sections are easily missed, and more questions get asked about the same thing, causing confusion and extra work for instructor's to answer them. The problem: questions aren't clearly associated with specific parts of an assignment, and they aren't displayed in a logical order or way that allow for easy retrieval of information. 

## Goal

Dogwood aims to solve this problem that exist in traditional forum-style discussion boards by integrating a Q&A interface directly inside an assignment, giving students the ability to ask question about a specific part of an assignment, and display them in a way that is intuitive for other students to find the answer that they are looking for. Dogwood is designed to be a Canvas plug-in that can be embedded into a Canvas course in place of the built-in "Assignments" page, or it can be used as a standalone site after Canvas assignment information has been retrieved. 

## Initial Planning

### The design

The design and look of dogwood is inspired by its predecessors: Piazza and Canvas's own discussion board. We wanted to incorporate what already works with these two products into what we thought they lacked: the context of the assignment description itself. As we envisioned this to be the entrypoint for a student into their assignment, we wanted the assignment description itself to take the center stage, and the discussion itself to take a supporting role, which is how we came to the initial design of having the description take up about 70% of the screen space, while questions and answers are shown in a sidebar on the right hand side. 

### Anchored Questions

A large part of our project revolves around the concept of an "anchored question": a question that has an anchor point. These anchor points are envisioned to be either a section, or a specific point in the text that needs more explanation. Due to concerns with the technical complexity, we started with working only with predetermined anchors: the instructor dictates which pieces of text are important enough to become an anchor, through the use of HTML tags; the software, on initial setup of the assignment, then scans the assignment text for these specified HTML tags and assigns an anchor to them, at which the students are then able to ask questions. 

### Q & A



## Feature Progression

## Current Status

## Future Plans

## How to start the development server

1. Install NodeJS and NPM
2. Clone this project
3. In a terminal, navigate to the root folder of the project repository
4. Run `npm install`
5. Run `npm run dev`

Congrats! Now the development server is running, with the front end React app running on Port 3000, and the back end Express app running on Port 4000.
