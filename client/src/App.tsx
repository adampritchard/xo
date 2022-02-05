import React from 'react';
import {
  PlayerKey,
  GameBoard,
  ClientMessage,
  ServerMessage,
  JoinedMessage,
  GameStatusMessage,
} from '../../types';

function sendMessage(ws: WebSocket, data: ClientMessage) {
  ws.send(JSON.stringify(data));
}

function parseMessage(data: string) {
  return JSON.parse(data) as ServerMessage;
}


const initialBoard: GameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

export function App() {
  const [socket, setWebSocket] = React.useState<WebSocket|null>(null);
  const [player, setPlayer] = React.useState<PlayerKey|null>(null);
  const [turn, setTurn] = React.useState<PlayerKey|null>(null);
  const [board, setBoard] = React.useState<GameBoard>(initialBoard);
  const [winner, setWinner] = React.useState<PlayerKey|null>(null);

  React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:8082');
    setWebSocket(ws);

    ws.addEventListener('message', (event) => {
      const data = parseMessage(event.data);

      function onJoined(data: JoinedMessage) {
        setPlayer(data.player);
      }
  
      function onGameStatus(data: GameStatusMessage) {
        setTurn(data.turn);
        setBoard(data.board);
        setWinner(data.winner);
      }

      if (data.type === 'joined')      onJoined(data);
      if (data.type === 'game-status') onGameStatus(data);
    });
  }, []);

  const onTakeTurn = React.useCallback((rowIndex, cellIndex) => {
    if (!socket) return;
    if (turn !== player) return;
    if (board[rowIndex][cellIndex] !== null) return;
    if (winner) return;

    sendMessage(socket, { type: 'take-turn', rowIndex, cellIndex });
  }, [socket, turn, player, board, winner]);

  console.log('winner', winner);

  return (
    <div>
      <PlayerHeading player={player} />

      {/* TODO: 'Waiting for another player...' */}

      {winner !== null
        ? <Winner player={player} winner={winner} />
        : turn === null
        ? null
        : turn === player
        ? <YourTurn />
        : <TheirTurn />
      }

      <Board board={board} onTakeTurn={onTakeTurn} />
    </div>
  );
}


type PlayerHeadingProps = {
  player: PlayerKey | null,
};

function PlayerHeading({ player }: PlayerHeadingProps) {
  function getHeadingText() {
    if (player === null) return 'You are not playing';
    if (player === 'o') return 'You are o';
    if (player === 'x') return 'You are x';
  }

  return <h3>{getHeadingText()}</h3>
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

type WinnerProps = {
  player: PlayerKey | null,
  winner: PlayerKey | null,
};

function Winner({ player, winner }: WinnerProps) {
  if (player === winner) return <h2>You Win!</h2>;
  return <h2>You Lose...</h2>;
}

type BoardProps = {
  board: GameBoard,
  onTakeTurn: (rowIndex: number, cellIndex: number) => void,
};

function Board({ board, onTakeTurn }: BoardProps) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        <Row key={rowIndex}>
          {row.map((cell, cellIndex) =>
            <Cell
              key={cellIndex}
              value={cell}
              onClick={() => onTakeTurn(rowIndex, cellIndex)}
            />
          )}
        </Row>
      )}
    </div>
  );
}


type RowProps = { children: React.ReactNode };

function Row({ children }: RowProps) {
  return (
    <div className="row">{children}</div>
  );
}


type CellProps = {
  value: PlayerKey | null,
  onClick: () => void,
};

function Cell({ value, onClick }: CellProps) {
  return (
    <div className="cell" onClick={onClick}>
      {value || <>&nbsp;</>}
    </div>
  );
}
