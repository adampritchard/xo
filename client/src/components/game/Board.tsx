import React from 'react';
import clsx from 'clsx';
import { PlayerKey, GameBoard, BoardPos, BoardLine } from 'shared/types';

type TakeTurnFn = (rowIndex: number, colIndex: number) => void;

type BoardProps = {
  board: GameBoard,
  lastTurn: BoardPos | null,
  winningLine: BoardLine | null,
  onTakeTurn: TakeTurnFn | null,
};

export function Board({ board, lastTurn, winningLine, onTakeTurn }: BoardProps) {
  return (
    <div className="board">
      {board.map((row, rowIndex) =>
        <Row key={rowIndex} rowIndex={rowIndex}>
          {row.map((cell, colIndex) =>
            <Cell
              key={colIndex}
              value={cell}
              onClick={onTakeTurn ? () => onTakeTurn(rowIndex, colIndex) : null}
              colIndex={colIndex}
              isHighlighted={isHighlighted(rowIndex, colIndex, lastTurn, winningLine)}
            />
          )}
        </Row>
      )}
    </div>
  );
}

function isHighlighted(row: number, col: number, lastTurn: BoardPos|null, winningLine: BoardLine|null): boolean {
  if (lastTurn) {
    if (row === lastTurn[0] && col === lastTurn[1]) {
      return true;
    }
  }

  if (winningLine) {
    for (const pos of winningLine) {
      if (row === pos[0] && col === pos[1]) {
        return true;
      } 
    }
  }
  
  return false;
}

type RowProps = {
  rowIndex: number,
  children: React.ReactNode,
};

function Row({ rowIndex, children }: RowProps) {
  return (
    <div className={`row row-${rowIndex}`}>
      {children}
    </div>
  );
}

type CellProps = {
  value: PlayerKey | null,
  onClick: (() => void) | null,
  colIndex: number,
  isHighlighted: boolean,
};

function Cell({ value, onClick, colIndex, isHighlighted }: CellProps) {
  const isPlayable = !value && !!onClick;

  return (
    <div
      className={clsx('cell', `col-${colIndex}`, isPlayable && 'cell--playable')}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className={clsx('piece', isHighlighted && 'piece--highlight')}>
        {value || <>&nbsp;</>}
      </div>
    </div>
  );
}
