const BOARD_SIZE = 15;

export const GameStatuses = {
    WAITING: 'waiting',
    STARTED: 'started',
    FINISHED: 'finished',
    ABANDONED: 'abandoned'
};

export class Gomoku {

    constructor (gameDoc) {
        if (gameDoc) {
            Object.assign(this, gameDoc);
        } else {
            const size = BOARD_SIZE;

            this.status = GameStatuses.WAITING;
            this.board = Array(size).fill(Array(size).fill(null));
            this.players = [];
        }
    }

    persistentFields () {
        return ['status', 'board', 'players'];
    }

    joinGame (user) {
        if (this.status !== GameStatuses.WAITING) {
            throw 'cannot join at current state';
        }

        if (this.userIndex(user) !== null) {
            throw 'user already in game';
        }

        this.players.push({
            userId: user._id,
            username: user.username
        });

        if (this.players.length === 2) {
            this.status = GameStatuses.STARTED;
        }
    }

    leaveGame (user) {
        if (this.status !== GameStatuses.WAITING) {
            throw 'cannot leave at current state';
        }

        if (this.userIndex(user) === null) {
            throw 'user not in game';
        }

        this.players.splice(this.players.findIndex((player) => player.userId === user._id), 1);

        if (this.players.length === 0) {
            this.status = GameStatuses.ABANDONED;
        }
    }

    placeStone (user, row, col) {
        const playerIndex = this.userIndex(user);
        const currentPlayerIndex = this.currentPlayerIndex();

        if (currentPlayerIndex !== playerIndex) {
            throw 'user cannot make move at current state';
        }

        if (row < 0 || row >= this.board.length || col < 0 || col >= this.board[row].length) {
            throw 'invalid row|col input';
        }

        if (this.board[row][col] !== null) {
            throw 'spot is filled';
        }

        this.board[row][col] = playerIndex;

        const winner = this.winner();

        if (winner !== null) {
            this.status = GameStatuses.FINISHED;
        }

        if (this.filledCount() >= BOARD_SIZE * BOARD_SIZE) {
            // all spots filled
            this.status = GameStatuses.FINISHED;
        }
    }

    currentPlayerIndex () {
        if (this.status !== GameStatuses.STARTED) {
            return null;
        }

        const filledCount = this.filledCount();

        return (filledCount % 2 === 0 ? 0 : 1);
    }

    winner () {
        const { board } = this;
        const size = board.length;
        const boardAsString = board.reduce((acc, row) => {
            acc += `${row.map((cell) => cell === null ? '.' : cell).join('')}|`;

            return acc;
        }, '');
        let win = null;

        this.players.forEach((player, i) => {
            const winColumn = boardAsString.match(
                `${i}.{${size}}${i}.{${size}}${i}.{${size}}${i}.{${size}}${i}`);
            const winRow = boardAsString.match(`${i}{5}`);
            const winBackDiagonal = boardAsString.match(
                `${i}.{${size + 1}}${i}.{${size + 1}}${i}.{${size + 1}}${i}.{${size + 1}}${i}`);
            const winDiagonal = boardAsString.match(
                `${i}.{${size - 1}}${i}.{${size - 1}}${i}.{${size - 1}}${i}.{${size - 1}}${i}`);

            if (winColumn || winRow || winBackDiagonal || winDiagonal) {
                win = i;
            }
        });

        return win;

    }

    userIndex (user) {
        const index = this.players.findIndex((player) => {
            return player.userId === user._id;
        });

        return index === -1 ? null : index;
    }

    /**
     * Private
     */
    filledCount () {
        const filledCount = this.board.reduce((acc, row) => {
            acc += row.reduce((acc, cell) => {
                acc += cell === null ? 0 : 1;

                return acc;
            }, 0);

            return acc;
        }, 0);

        return filledCount;
    }
}
