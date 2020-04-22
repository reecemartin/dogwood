import React from 'react';
import {Link} from "react-router-dom";

const home = props => {
  return (
    <div>
      <h3>home</h3>
      <Link to="/courses/6119">
        Link to Course
      </Link>
      <br/>

      <Link to="/courses/6119/assignments/288779">
        Link to Assignment
      </Link>
    </div>
  )
}

export default home;