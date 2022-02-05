import { WebSocketServer, WebSocket, RawData } from 'ws';
import { PlayerKey, GameState, ServerMessage } from '../types';

type Players = {
  [key in PlayerKey]: WebSocket | null;
};

const players: Players = {
  o: null,
  x: null,
};

const game: GameState = {
  turn: null,
  winner: null,
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
};

const server = new WebSocketServer({ port: 8082 });

server.on('connection', (ws, req) => {
  console.log('new connection');

  if (isGameFull()) return rejectPlayer(ws);

  if (!hasPlayer('o')) {
    setPlayer('o', ws);
  } else if (!hasPlayer('x')) {
    setPlayer('x', ws);
  }

  updateGameStatus();
});

function sendMessage(ws: WebSocket, data: ServerMessage) {
  ws.send(JSON.stringify(data));
}

function parseMessage(buffer: RawData) {
  return JSON.parse(buffer.toString());
}

function hasPlayer(key: PlayerKey) {
  return players[key];
}

function getPlayerKey(player: WebSocket) {
  const result = Object.entries(players).find(([key, plyr]) => plyr === player);
  return result ? result[0] : null;
}

function setPlayer(key: PlayerKey, ws: WebSocket) {
  console.log(`player ${key} joined`);

  players[key] = ws;

  sendMessage(ws, {
    type: 'joined',
    player: key,
  });

  ws.on('close', () => {
    console.log(`player ${key} left`);
    players[key] = null;
  });

  ws.on('message', (buffer) => {
    const data = parseMessage(buffer);
    console.log(`message from player ${key}`, data);

    if (data.type === 'take-turn') {
      takeTurn(ws, data.rowIndex, data.cellIndex);
    }
  });
}

function rejectPlayer(ws: WebSocket) {
  console.log('player rejected');

  sendMessage(ws, {
    type: 'joined',
    player: null,
  });
}

function startGame() {
  game.turn = 'o';
}

function hasWinner() {
  return !!game.winner;
}

function checkForWinner() {
  const winningLines = [
    // rows.
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],

    // cols.
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],

    // diagonals.
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]],
  ];

  for (const line of winningLines) {
    game.winner = winnerForLine(line);
    if (game.winner) break;
  }
}

function winnerForLine(line: number[][]) {
  const [aRow, aCell] = line[0];
  const [bRow, bCell] = line[1];
  const [cRow, cCell] = line[2];

  const a = game.board[aRow][aCell];
  const b = game.board[bRow][bCell];
  const c = game.board[cRow][cCell];

  if (a && b && c && a === b && b === c) {
    return a;
  }

  return null;
}

function takeTurn(player: WebSocket, rowIndex: number, cellIndex: number) {
  const key = getPlayerKey(player);
  if (key === game.turn) {

    if (game.board[rowIndex][cellIndex] === null) {
      game.board[rowIndex][cellIndex] = key;

      checkForWinner();
      if (!hasWinner()) nextTurn();
      notifyPlayers();
    }
  }
}

function nextTurn() {
  if (game.turn === 'o') {
    game.turn = 'x';
  } else if (game.turn === 'x') {
    game.turn = 'o';
  }
}

function notifyPlayers() {
  let key: keyof typeof players;
  for (key in players) {
    const ws = players[key];
    if (!ws) continue;

    sendMessage(ws, {
      type: 'game-status',
      player: key,
      turn: game.turn,
      board: game.board,
      winner: game.winner,
    });
  }
}

function updateGameStatus() {
  if (!game.turn) {
    if (hasPlayer('o') && hasPlayer('x')) {
      startGame();
    }
  }

  notifyPlayers();
}

function isGameFull() {
  return hasPlayer('o') && hasPlayer('x');
}
