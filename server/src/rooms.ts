import { WebSocket } from 'ws';
import { PlayerKey, GameState, GameBoard } from 'shared/types';
import { parseMessage, sendMessage, randomLetter } from './utils';

class GameRules {
  public static checkForWinner(board: GameBoard): PlayerKey | null {
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
      const winner = this.winnerForLine(board, line);
      if (winner) return winner;
    }

    return null;
  }
  
  private static winnerForLine(board: GameBoard, line: number[][]) {
    const [aRow, aCell] = line[0];
    const [bRow, bCell] = line[1];
    const [cRow, cCell] = line[2];
  
    const a = board[aRow][aCell];
    const b = board[bRow][bCell];
    const c = board[cRow][cCell];
  
    if (a && b && c && a === b && b === c) {
      return a;
    }
  
    return null;
  }
}

class Room {
  private roomId: string;

  private players = new Map<PlayerKey, WebSocket>();

  private game: GameState = {
    turn: null,
    winner: null,
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  };

  public constructor(roomId: string) {
    this.roomId = roomId;
  }

  public join(ws: WebSocket): void {
    if (!this.players.has('o')) {
      this.setPlayer(ws, 'o');
    } else if (!this.players.has('x')) {
      this.setPlayer(ws, 'x');
    } else {
      sendMessage(ws, {
        type: 'room-full',
        roomId: this.roomId,
      });
    }
  }

  private setPlayer(ws: WebSocket, key: PlayerKey) {
    console.log(`player ${key} joined room ${this.roomId}`);
  
    this.players.set(key, ws);
  
    sendMessage(ws, {
      type: 'room-joined',
      roomId: this.roomId,
      player: key,
    });
  
    ws.on('close', () => {
      console.log(`player ${key} left room ${this.roomId}`);
      this.players.delete(key);
    });
  
    ws.on('message', (buffer) => {
      const data = parseMessage(buffer);
      console.log(`message from player ${key}`, data);
  
      if (data.type === 'take-turn') {
        this.takeTurn(ws, key, data.rowIndex, data.cellIndex);
      }
    });

    // If we're ready, start the game.
    if (!this.game.turn && this.players.has('o') && this.players.has('x')) {
      this.nextTurn();
    }
  
    this.notifyPlayers();
  }

  private takeTurn(ws: WebSocket, key: PlayerKey, rowIndex: number, cellIndex: number) {
    if (key !== this.game.turn) return;

    if (this.game.board[rowIndex][cellIndex] === null) {
      this.game.board[rowIndex][cellIndex] = key;

      this.game.winner = GameRules.checkForWinner(this.game.board);
      if (!this.game.winner) this.nextTurn();
      this.notifyPlayers();
    }
  }
  
  private nextTurn() {
    if (this.game.turn === null) {
      this.game.turn = 'o';
    } else if (this.game.turn === 'o') {
      this.game.turn = 'x';
    } else if (this.game.turn === 'x') {
      this.game.turn = 'o';
    }
  }

  private notifyPlayers() {
    this.players.forEach((ws, key) => {
      sendMessage(ws, {
        type: 'game-state',
        roomId: this.roomId,
        player: key,
        game: this.game,
      });
    });
  }
}

export class Rooms {
  private static rooms = new Map<string, Room>();

  public static create() {
    const roomId = this.generateId();
    this.rooms.set(roomId, new Room(roomId));

    // TODO: set a timeout on the room...
    //       maybe set an 'expiryTimestamp' on the room or something?

    return roomId;
  }

  public static join(ws: WebSocket, roomId: string) {
    const room = this.rooms.get(roomId);

    if (room) {
      room.join(ws);
    } else {
      sendMessage(ws, {
        type: 'room-not-found',
        roomId,
      });
    }
  }

  private static generateId(): string {
    return randomLetter() + randomLetter() + randomLetter() + randomLetter();
  } 
}
