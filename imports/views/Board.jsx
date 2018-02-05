import React, { Component } from 'react';
import { GameStatuses } from '../api/models/gomoku.js';
import { userPlaceStone } from '../api/methods/games.js';

export default class Board extends Component {

    handleCellClick(row, col) {
        const game = this.props.game;

        userPlaceStone.call({ gameId: game._id, row, col });
    }

    backToGameList() {
        this.props.backToGameListHandler();
    }

    renderCell(row, col) {
        const value = this.props.game.board[row][col];

        if (value === 0) return (<div key={ `${row}:${col}` } className='black-stone'></div>);
        if (value === 1) return (<div key={ `${row}:${col}` } className='white-stone'></div>);
        if (value === null) return (
            <div key={ `${row}:${col}` } className='empty-spot' onClick = { this.handleCellClick.bind(this, row, col) }></div>
        );
    }

    renderStatus() {
        const game = this.props.game;
        let status = '';

        if (game.status === GameStatuses.STARTED) {
            const playerIndex = game.currentPlayerIndex();

            status = `Game in progress: players turn: ${ game.players[playerIndex].username }`;
        } else if (game.status === GameStatuses.FINISHED) {
            const winnerIndex = game.winner();

            if (winnerIndex === null) {
                status = 'Game over: tie';
            } else {
                status = `Game over: winner: ${ game.players[winnerIndex].username }`;
            }
        }

        return (<div>{ status }</div>);
    }

    render() {
        const size = this.props.game.board.length;

        return (
            <div>

                <button onClick = { this.backToGameList.bind(this) }>Back</button>
                { this.renderStatus() }

                <div className='main-board'>
                    <svg width="737" height="737" xmlns="http://www.w3.org/2000/svg" id='board-grid'>
                        <defs>
                            <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
                                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    <div id='board-pieces'>
                        { this.props.game.board.map((row, rowIndex) => {
                            return (
                                <div key={ rowIndex } className='board-row'>
                                    { row.map((cell, colIndex) => {
                                        return this.renderCell(rowIndex, colIndex);
                                    }) }
                                </div>
                            )
                        }) }
                    </div>
                </div>
            </div>
        )
    }
}
