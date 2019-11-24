import React from 'react';
import { Link } from "react-router-dom";

class HomePage extends React.Component {
  render(){
    return (
      <>
      <div className="home-page">
        <div className="home-page-container">
          <h1>Welcome</h1>
          <h4>Please enjoy this Sherlock Holmes inspired Sudoku game</h4>
          <Link
          to="/game"
          className="ui huge primary button"
          >{`Let's Play!`}</Link>
        </div>
      </div>
      <div className="wrapper">
        <div className="ui inverted button">
          <Link to="/about">About</Link>
        </div>
      </div>
      </>
    );
  }

}

export default HomePage;