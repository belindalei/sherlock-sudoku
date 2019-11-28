import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Game from "./Game";
import HomePage from './HomePage';
import AboutPage from './AboutPage'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route
            path="/game"
            render={() => (
              <Game />
            )}
          />
          <Route path="/about" render={() => <AboutPage />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
