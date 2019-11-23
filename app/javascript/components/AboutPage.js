import React from 'react';

class AboutPage extends React.Component {
  render(){
    return (
      <div>
        <div className="ui centered aligned grid">
          <h1 className="ui header">About</h1>
          <h3 className="ui header">
            This site is in loving memory of my grandfather, who passed away at
            the age of 89 on November 20th, 2019. A thinker, lawyer, and
            professor, he loved the wittiness of Sherlock Holmes and his
            adventures.
          </h3>
        </div>
      </div>
    );
  }
}

export default AboutPage;