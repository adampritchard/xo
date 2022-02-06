import React from 'react';
import { PlayerKey, GameBoard } from 'shared/types';

type BoardProps = {
  board: GameBoard,
  onTakeTurn: (rowIndex: number, cellIndex: number) => void,
};

export function Board({ board, onTakeTurn }: BoardProps) {
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
