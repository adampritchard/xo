import React from 'react';
import { useParams } from 'react-router-dom';
import {
  PlayerKey,
  GameStateMessage,
  GameState,
  RoomJoinedMessge,
  RoomFullMessage,
  RoomNotFoundMessage,
} from 'shared/types';
import { PlayerHeading, Board, Winner } from 'components';
import { parseMessage, sendMessage, UnreachableCaseError } from 'utils/misc';

type Status = 'init' | 'room-joined' | 'room-full' | 'room-not-found' | 'room-closed';

const initialGame: GameState = {
  turn: null,
  winner: null,
  board: [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ],
};

export function Room() {
  const { roomId } = useParams();
  
  const [status, setStatus] = React.useState<Status>('init');
  const [socket, setWebSocket] = React.useState<WebSocket|null>(null);
  const [player, setPlayer] = React.useState<PlayerKey|null>(null);
  const [game, setGame] = React.useState<GameState>(initialGame);
  const [expiresIn, setExpiresIn] = React.useState<string|null>(null);

  React.useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket('ws://localhost:8082');
    setWebSocket(ws);

    ws.addEventListener('open', (event) => {
      sendMessage(ws, {
        type: 'join-room',
        roomId,
      });
    });

    ws.addEventListener('close', (event) => {
      setStatus('room-closed');
    });

    ws.addEventListener('message', (event) => {
      const data = parseMessage(event.data);
  
      function onGameStatus(data: GameStateMessage) {
        setGame(data.game);
        setExpiresIn(data.expiresIn);
      }

      function onRoomJoined(data: RoomJoinedMessge) {
        setStatus('room-joined');
        setPlayer(data.player);
        setExpiresIn(data.expiresIn);
      }

      function onRoomFull(data: RoomFullMessage) {
        setStatus('room-full');
      }

      function onRoomNotFound(data: RoomNotFoundMessage) {
        setStatus('room-not-found');
      }

      const { type } = data;
      switch (type) {
        case 'room-joined':    return onRoomJoined(data);
        case 'room-full':      return onRoomFull(data);
        case 'room-not-found': return onRoomNotFound(data);
        case 'game-state':     return onGameStatus(data);

        default: throw new UnreachableCaseError(type);
      }
    });
  }, [roomId]);

  const onTakeTurn = React.useCallback((row: number, col: number) => {
    if (!socket) return;
    if (game.turn !== player) return;
    if (game.board[row][col] !== null) return;
    if (game.winner) return;

    sendMessage(socket, { type: 'take-turn', row, col });
  }, [socket, player, game]);

  if (status === 'init') {
    return <div><h1>Loading</h1></div>;
  }

  if (status === 'room-full') {
    return <div><h1>This Room is Full :(</h1></div>;
  }

  if (status === 'room-not-found') {
    return <div><h1>Room Not Found</h1></div>;
  }

  if (status === 'room-closed') {
    return <div><h1>This Room is Now Closed :(</h1></div>;
  }

  return (
    <div>
      <PlayerHeading player={player} />

      {/* TODO: 'Waiting for another player...' */}

      {game.winner !== null
        ? <Winner player={player} winner={game.winner} />
        : game.turn === null
        ? null
        : game.turn === player
        ? <YourTurn />
        : <TheirTurn />
      }

      <Board board={game.board} onTakeTurn={onTakeTurn} />

      {expiresIn &&
        <div>This room will self-desctruct in {expiresIn}</div>
      }
    </div>
  );
}

function TheirTurn() {
  return (
    <div>
      <h3>Their turn...</h3>
    </div>
  );
}

function YourTurn() {
  return (
    <div>
      <h3>Your Turn</h3>
    </div>
  );
}
