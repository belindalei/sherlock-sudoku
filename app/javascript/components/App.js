import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import GamePage from "./GamePage";
import HomePage from './HomePage';
import AboutPage from './AboutPage'
import configureStore from "../configureStore";
const store = configureStore();

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch> 
            <Route exact path="/" render={() => <HomePage />} />
            <Route
              path="/game"
              render={() => <GamePage greeting="Friend" />}
            />
            <Route
              path="/about"
              render={() => <AboutPage />}
            />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
