import React from 'react';
import {
  PlayerKey,
  ClientMessage,
  ServerMessage,
  JoinedMessage,
  GameStateMessage,
  GameState,
  initialGame,
  PingCountMessage,
} from 'shared/types';
import { PlayerHeading, Board, Winner } from 'components';

function sendMessage(ws: WebSocket, data: ClientMessage) {
  ws.send(JSON.stringify(data));
}

function parseMessage(data: string) {
  return JSON.parse(data) as ServerMessage;
}

export function App() {
  const [socket, setWebSocket] = React.useState<WebSocket|null>(null);
  const [player, setPlayer] = React.useState<PlayerKey|null>(null);
  const [game, setGame] = React.useState<GameState>(initialGame);
  const [pingCount, setPingCount] = React.useState<number|null>(null);

  React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:8082');
    setWebSocket(ws);

    ws.addEventListener('message', (event) => {
      const data = parseMessage(event.data);

      function onJoined(data: JoinedMessage) {
        setPlayer(data.player);
      }
  
      function onGameStatus(data: GameStateMessage) {
        setGame(data.game);
      }

      function onPingCount(data: PingCountMessage) {
        setPingCount(data.count);
      }

      if (data.type === 'joined')     onJoined(data);
      if (data.type === 'game-state') onGameStatus(data);
      if (data.type === 'ping-count') onPingCount(data);
    });
  }, []);

  const onTakeTurn = React.useCallback((rowIndex: number, cellIndex: number) => {
    if (!socket) return;
    if (game.turn !== player) return;
    if (game.board[rowIndex][cellIndex] !== null) return;
    if (game.winner) return;

    sendMessage(socket, { type: 'take-turn', rowIndex, cellIndex });
  }, [socket, player, game]);

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

      <div>
        Ping Count: {pingCount ?? 'unknown'}
      </div>
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
