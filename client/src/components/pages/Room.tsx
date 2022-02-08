import React from 'react';
import { useParams } from 'react-router-dom';
import {
  PlayerKey,
  GameStateMessage,
  GameState,
  RoomJoinedMessge,
  RoomFullMessage,
  RoomNotFoundMessage,
  Winner,
} from 'shared/types';
import { Board } from 'components/game';
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
  lastTurn: null,
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

  const onTakeTurn = React.useMemo(() => {
    if (!socket) return null;
    if (game.turn !== player) return null;
    if (game.winner) return null;

    return (row: number, col: number) => {
      if (game.board[row][col] === null) {
        sendMessage(socket, { type: 'take-turn', row, col });
      }
    };
  }, [socket, player, game]);

  if (status === 'init') {
    return null;
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
    <div className="room-page">
      {game.winner !== null
        ? <WinnerHeader player={player} winner={game.winner} />
        : game.turn === null
        ? <InviteHeader />
        : <TurnHeader player={player} turn={game.turn} />
      }

      <Board
        board={game.board}
        lastTurn={game.lastTurn}
        onTakeTurn={onTakeTurn}
      />

      {expiresIn &&
        <div>This room will self-destruct in {expiresIn}</div>
      }
    </div>
  );
}


type WinnerHeaderProps = {
  player: PlayerKey | null,
  winner: Winner,
};

function WinnerHeader({ player, winner }: WinnerHeaderProps) {
  const winnerText = winner === 'draw'
    ? 'Draw... 😴'
    : player === winner
    ? 'You Win! 🎉'
    : 'You Lose 😭';

  return (
    <div>
      <YouAre player={player} />
      <h1>{winnerText}</h1>
    </div>
  );
}


function InviteHeader() {
  return (
    <div>
      <h2>Invite someone to play</h2>
      <h1 className="text-primary">{window.location.host}{window.location.pathname}</h1>
    </div>
  );
}


type TurnHeaderProps = {
  player: PlayerKey | null,
  turn: PlayerKey,
};

function TurnHeader({ player, turn }: TurnHeaderProps) {
  return (
    <div>
      <YouAre player={player} />
      <h1>{turn === player ? 'Your Turn' : 'Their Turn...'}</h1>
    </div>
  );
}


type YouAreProps = {
  player: PlayerKey | null,
};

function YouAre({ player }: YouAreProps) {
  return (
    <h2>You are <span className="text-primary text-weight-normal">{player}</span></h2>
  );
}
