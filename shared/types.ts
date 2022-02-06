export type PlayerKey = 'o' | 'x';
export type GameBoard = (PlayerKey | null)[][];

export type GameState = {
  turn: PlayerKey | null,
  winner: PlayerKey | null,
  board: GameBoard,
};

export type ServerMessage =
  | RoomJoinedMessge
  | RoomFullMessage
  | RoomNotFoundMessage
  | GameStateMessage
  | PingCountMessage;

export type RoomJoinedMessge = {
  type: 'room-joined',
  player: PlayerKey | null,
  roomId: string,
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
  player: PlayerKey | null,
  game: GameState,
};

export type PingCountMessage = {
  type: 'ping-count',
  count: number,
};

export type ClientMessage =
    TakeTurnMessage
  | JoinRoomMessage;

type JoinRoomMessage = {
  type: 'join-room',
  roomId: string,
};

type TakeTurnMessage = {
  type: 'take-turn',
  rowIndex: number,
  cellIndex: number,
};

export type CreateRoomRes = {
  roomId: string | null,
};
