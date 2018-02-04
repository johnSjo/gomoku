import { Meteor } from 'meteor/meteor';
import Games from '../imports/api/collections/games.js'; // import Games collection

const SMALL_BOARD = 15;
const BIG_BOARD = 19;

Meteor.startup(() => {

    // remove all existing game documents
    Games.remove({});

    const size = SMALL_BOARD;
    const board = Array(size).fill(Array(size).fill(null));

    const gameDoc = { board };

    Games.insert(gameDoc);
});
