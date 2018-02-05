import { Mongo } from 'meteor/mongo';
import { Gomoku } from '../models/gomoku';

const Games = new Mongo.Collection('games', {
    transform (doc) {
        return new Gomoku(doc);
    }
});

Object.assign(Games, {
    saveGame (game) {

        const gameDoc = {};

        game.persistentFields().forEach((field) => {
            gameDoc[field] = game[field];
        });

        if (game._id) {
            Games.update(game._id, { $set: gameDoc });
        } else {
            Games.insert(gameDoc);
        }
    }
});

export default Games;
