import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Games from '../api/db/games.js';
import GameList from './GameList.jsx';
import Board from './Board.jsx';
import Login from './Login.jsx';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { selectedGameId: null }
    }

    enterGame(gameId) {
        this.setState({ selectedGameId: gameId });
    }

    doLogout() {
        Meteor.logout();
    }

    returnToGameList() {
        this.setState({ selectedGameId: null });
    }

    selectedGame() {
        const selectedGame = this.props.games.find((game) => {
            return game._id === this.state.selectedGameId;
        });

        return selectedGame;
    }

    addHeader() {
        return (
            <div>
                <h1>Gomoku game</h1>

                {
                    this.props.user ?
                    (<button onClick = { this.doLogout.bind(this) }>Logout: { this.props.user.username }</button>) :
                    null
                }
            </div>
        );
    }

    render() {

        if (!this.props.user) {
            return (
              <div>
                   <Login/>
              </div>
            )
        }

        if (this.state.selectedGameId === null) {
            return (
                <div>
                    { this.addHeader() }
                    <GameList
                        games = { this.props.games }
                        enterGameHandler = { this.enterGame.bind(this) }
                        user = { this.props.user }/>
                </div>
            )
        } else {
            return (
                <div>
                    { this.addHeader() }
                    <Board
                        game = { this.selectedGame() }
                        backToGameListHandler = { this.returnToGameList.bind(this) }
                        user = { this.props.user }/>
                </div>
            )
        }
    }
}

export default withTracker(() => {
    Meteor.subscribe('games');

    return {
        user: Meteor.user(),
        games: Games.find().fetch()
    };
}) (App);
