import React from 'react';
import { Link } from "react-router-dom";

class AboutPage extends React.Component {
  render(){
    return (
      <body>
        <div className="about-container">
          <h1>About</h1>
          <h3>
            This site is in loving memory of my grandfather, who passed away at
            the age of 90 on November 20th, 2019. A thinker, lawyer, and
            professor, he loved the wittiness of Sherlock Holmes and his
            adventures.
          </h3>
        </div>
        <div className="wrapper">
          <div className="ui inverted button">
            <Link to="/">Return Home</Link>
          </div>
        </div>
      </body>
    );
  }
}

export default AboutPage;