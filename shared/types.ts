export type PlayerKey = 'o' | 'x';
export type GameBoard = (PlayerKey | null)[][];

export type GameState = {
  turn: PlayerKey | null,
  winner: PlayerKey | null,
  board: GameBoard,
};

export type ServerMessage =
    JoinedMessage
  | GameStateMessage;

export type JoinedMessage = {
  type: 'joined',
  player: PlayerKey | null,
};

export type GameStateMessage = {
  type: 'game-state',
  player: PlayerKey | null,
  game: GameState,
};

export type ClientMessage = {
  type: 'take-turn',
  rowIndex: number,
  cellIndex: number,
};

export const initialGame: GameState = {
  turn: null,
  winner: null,
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
};
