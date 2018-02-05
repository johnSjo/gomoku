import React, { Component } from 'react';
import Header from './Header.jsx';
import { GameStatuses } from '../api/models/gomoku.js';
import { newGame, userJoinGame, userLeaveGame } from '../api/methods/games.js';

export default class GameList extends Component {
    handleNewGame() {
        newGame.call({});
    }

    handleLeaveGame(gameId) {
        userLeaveGame.call({ gameId });
      }

    handleEnterGame(gameId) {
        this.props.enterGameHandler(gameId);
    }

    handleJoinGame(gameId) {
        userJoinGame.call({ gameId });
    }

    activeGames() {
        return this.props.games.filter((game) => {
            return game.status === GameStatuses.WAITING || game.status === GameStatuses.STARTED;
        });
    }

    myCurrentGameId() {
        const game = this.activeGames().find((game) => {
            return game.userIndex(this.props.user) !== null;
        });

        return game === undefined ? null : game._id;
    }

    renderPlayers(game) {
        const player1 = game.players.length > 0? game.players[0].username: '';
        const player2 = game.players.length > 1? game.players[1].username: '';

        return (
            <span>[{ player1 }] vs [{ player2 }]</span>
        )
    }

    render() {
        return (
            <div>
                <div>
                    <Header user = { this.props.user }/>
                    <h2>List of games</h2>

                    {this.activeGames().map((game, index) => {
                        return (
                            <div key={game._id}>
                                <span>Game {index+1}</span>
                                {this.renderPlayers(game)}

                                {
                                    this.myCurrentGameId() === game._id && game.status === GameStatuses.WAITING ?
                                    (<button onClick = { this.handleLeaveGame.bind(this, game._id) }>Leave</button>) :
                                    null
                                }

                                {
                                    this.myCurrentGameId() === null && game.status === GameStatuses.WAITING ?
                                    (<button onClick = { this.handleJoinGame.bind(this, game._id) }>Join</button>) :
                                    null
                                }

                                {
                                    game.status === GameStatuses.STARTED ?
                                    (<button onClick = { this.handleEnterGame.bind(this, game._id) }>Enter</button>) :
                                    null
                                }
                            </div>
                        )
                    })}
                </div>

                {
                    this.myCurrentGameId() === null ?
                    (<div>
                        <button onClick = { this.handleNewGame.bind(this) }>New Game</button>
                    </div>) :
                    null
                }
            </div>
        )
    }
}
