export type PlayerKey = 'o' | 'x';
export type GameBoard = (PlayerKey | null)[][];

export type GameState = {
  turn: PlayerKey | null,
  winner: PlayerKey | null,
  board: GameBoard,
};

export type ServerMessage =
    JoinedMessage
  | GameStatusMessage;

export type JoinedMessage = {
  type: 'joined',
  player: PlayerKey | null,
};

export type GameStatusMessage = {
  type: 'game-status',
  player: PlayerKey | null,
  turn: PlayerKey | null,
  winner: PlayerKey | null,
  board: GameBoard,
};

export type ClientMessage = {
  type: 'take-turn',
  rowIndex: number,
  cellIndex: number,
};
