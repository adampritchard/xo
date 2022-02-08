import React from 'react';
import clsx from 'clsx';
import { PlayerKey, GameBoard, BoardPos } from 'shared/types';

type TakeTurnFn = (rowIndex: number, colIndex: number) => void;

type BoardProps = {
  board: GameBoard,
  lastTurn: BoardPos | null,
  onTakeTurn: TakeTurnFn | null,
};

export function Board({ board, lastTurn, onTakeTurn }: BoardProps) {
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
              isLatest={rowIndex === lastTurn?.row && colIndex === lastTurn?.col}
            />
          )}
        </Row>
      )}
    </div>
  );
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
  isLatest: boolean,
};

function Cell({ value, onClick, colIndex, isLatest }: CellProps) {
  const isPlayable = !value && !!onClick;

  return (
    <div
      className={clsx('cell', `col-${colIndex}`, isPlayable && 'cell--playable')}
      onClick={isPlayable ? onClick : undefined}
    >
      <div className={clsx('piece', isLatest && 'piece--highlight')}>
        {value || <>&nbsp;</>}
      </div>
    </div>
  );
}
