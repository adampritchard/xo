export type StringMap = { [key: string]: string };

export type PlayerKey = 'o' | 'x';
export type GameBoard = (PlayerKey | null)[][];

export type Winner = PlayerKey | 'draw';

export type BoardPos = [number, number];
export type BoardLine = [BoardPos, BoardPos, BoardPos];

export type GameResult = {
  winner: Winner,
  winningLine: BoardLine | null,
};

export type GameState = {
  board: GameBoard,
  turn: PlayerKey | null,
  lastTurn: BoardPos | null,
  result: GameResult | null,
};

export type RoomStatus = 'init' | 'room-joined' | 'room-full' | 'room-not-found' | 'room-closed';

export type ServerMessage =
  | RoomJoinedMessge
  | RoomFullMessage
  | RoomNotFoundMessage
  | GameStateMessage;

export type RoomJoinedMessge = {
  type: 'room-joined',
  roomId: string,
  expiresIn: string,
  player: PlayerKey,
};

export type RoomFullMessage = {
  type: 'room-full',
  roomId: string,
};

export type RoomNotFoundMessage = {
  type: 'room-not-found',
  roomId: string,
};

export type GameStateMessage = {
  type: 'game-state',
  roomId: string,
  expiresIn: string,
  player: PlayerKey,
  game: GameState,
};

export type ClientMessage =
  | JoinRoomMessage
  | TakeTurnMessage;

type JoinRoomMessage = {
  type: 'join-room',
  roomId: string,
};

type TakeTurnMessage = {
  type: 'take-turn',
  row: number,
  col: number,
};

export type CreateRoomRes = {
  roomId: string | null,
};
