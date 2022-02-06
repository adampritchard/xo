import { WebSocket } from 'ws';
import { PlayerKey, GameState } from 'shared/types';
import { parseMessage, sendMessage } from './utils';
import { Game } from './game';

export class Room {
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
        this.takeTurn(ws, key, data.row, data.col);
      }
    });

    // If we're ready, start the game.
    if (!this.game.turn && this.players.has('o') && this.players.has('x')) {
      this.nextTurn();
    }
  
    this.notifyPlayers();
  }

  private takeTurn(ws: WebSocket, key: PlayerKey, row: number, col: number) {
    if (key !== this.game.turn) return;

    if (Game.isCellEmpty(this.game.board, row, col)) {
      Game.setCell(this.game.board, row, col, key);

      this.game.winner = Game.checkForWinner(this.game.board);
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
