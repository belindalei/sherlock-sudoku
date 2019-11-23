import React from 'react';
import NavBar from '../components/HeaderComponent/NavBar'
import { Link } from "react-router-dom";
import AboutPage from '../components/AboutPage'

class HomePage extends React.Component {
  render(){
    return (
      <div className="galaxy">
        <div className="ui inverted vertical masthead center aligned segment">
          <div className="ui large secondary inverted pointing menu">
            <div className="right item">
              <NavBar />
            </div>
          </div>
          <h1 className="ui inverted header">Home</h1>
          <h2>Welcome to the Sherlock Holmes inspired Sudoku game</h2>
          <Link
            to="/game"
            className="ui huge primary button"
          >{`Let's Play!`}</Link>
        </div>
      </div>
    );
  }

}

export default HomePage;