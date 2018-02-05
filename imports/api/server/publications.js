/* global Meteor */

import { GameStatuses } from '../models/gomoku.js';
import Games from '../db/games.js';

Meteor.publish('games', () => {
    // TODO: find out why 'this.userId' is undefined
    // if (this.userId) {
    if (Meteor.user()) {
        return Games.find({ status: { $in: [
            GameStatuses.WAITING,
            GameStatuses.STARTED,
            GameStatuses.FINISHED
        ] } });
    } else {
        return null;
    }
});
