export type PlayerKey = 'o' | 'x';
export type GameBoard = (PlayerKey | null)[][];

export type Winner = PlayerKey | 'draw' | null;

export type GameState = {
  turn: PlayerKey | null,
  winner: Winner,
  board: GameBoard,
};

export type ServerMessage =
  | RoomJoinedMessge
  | RoomFullMessage
  | RoomNotFoundMessage
  | GameStateMessage;

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

export type ClientMessage =
    TakeTurnMessage
  | JoinRoomMessage;

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
