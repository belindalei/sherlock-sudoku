import React from 'react'
import { connect } from 'react-redux';
import { createStructuredSelector} from 'reselect';

const GET_GAMES_REQUEST = 'GET_GAMES_REQUEST';
const GET_GAMES_SUCCESS = 'GET_GAMES_SUCCESS';

function getGames(){
  console.log('getGames() Action!!')
  return dispatch => {
    dispatch({ type: GET_GAMES_REQUEST })
    return fetch(`v1/games.json`)
      .then(response => response.json())
      .then(json => dispatch(getGamesSuccess(json)))
      .catch(error => console.log(error))
  }
}

export function getGamesSuccess(json){
  return{
    type: GET_GAMES_SUCCESS,
    json
  }
}

class GamePage extends React.Component {
  render () {
    const { games } = this.props; 
    const gamesList = games.map((game)=> {
      return (
        <List.Item>
          <List.Header as='a'>{game.name}</List.Header>
          <List.Description as='a'>{game.guid}</List.Description>
        </List.Item>
      );
    })
    return (
      <React.Fragment>
        Greeting: {this.props.greeting}

        <button className="getGamesBtn" onClick={()=>this.props.getGames()}>getGames</button>
        <br/>
        <ul>{ gamesList }</ul>
      </React.Fragment>
    );
  }
}

const structuredSelector = createStructuredSelector({
  games: state => state.games,
})

const mapDispatchToProps = { getGames };

export default connect(structuredSelector, mapDispatchToProps)(GamePage);
