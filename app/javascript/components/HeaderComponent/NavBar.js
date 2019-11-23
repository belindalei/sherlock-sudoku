import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
  render() {
    return (
      <div className="ui inverted button">
        <Link to="/about">About</Link>
      </div>
    );
  }
}
export default NavBar;