import { Gomoku } from '../models/gomoku.js';
import Games from '../db/games.js';

export const GamesController = {
    newGame (user) {
        const game = new Gomoku();

        game.joinGame(user);
        Games.saveGame(game);
    },

    userJoinGame (gameId, user) {
        const game = Games.findOne(gameId);

        game.joinGame(user);
        Games.saveGame(game);
    },

    userLeaveGame (gameId, user) {
        const game = Games.findOne(gameId);

        game.leaveGame(user);
        Games.saveGame(game);
    },

    userPlaceStone (gameId, user, row, col) {
        const game = Games.findOne(gameId);

        game.placeStone(user, row, col);
        Games.saveGame(game);
    }
};
