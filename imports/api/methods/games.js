/* global Meteor, ValidatedMethod, SimpleSchema */

import { GamesController } from '../controllers/gamesController.js';

export const newGame = new ValidatedMethod ({
    name: 'games.newGame',
    validate: new SimpleSchema({}).validator(),
    run ({}) {
        GamesController.newGame(Meteor.user());
    }
});

export const userJoinGame = new ValidatedMethod({
    name: 'games.userJoinGame',
    validate: new SimpleSchema({
        gameId: { type: String }
    }).validator(),
    run ({ gameId }) {
        GamesController.userJoinGame(gameId, Meteor.user());
    }
});

export const userLeaveGame = new ValidatedMethod({
    name: 'games.userLeaveGame',
    validate: new SimpleSchema({
        gameId: { type: String }
    }).validator(),
    run ({ gameId }) {
        GamesController.userLeaveGame(gameId, Meteor.user());
    }
});

export const userPlaceStone = new ValidatedMethod({
    name: 'games.userPlaceStone',
    validate: new SimpleSchema({
        gameId: { type: String },
        row: { type: Number },
        col: { type: Number }
    }).validator(),
    run ({ gameId, row, col }) {
        GamesController.userPlaceStone(gameId, Meteor.user(), row, col);
    }
});
