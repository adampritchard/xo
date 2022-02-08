import React from 'react';
import clsx from 'clsx';
import { PlayerKey, GameBoard } from 'shared/types';

type TakeTurnFn = (rowIndex: number, colIndex: number) => void;

type BoardProps = {
  board: GameBoard,
  onTakeTurn: TakeTurnFn | null,
};

export function Board({ board, onTakeTurn }: BoardProps) {
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
};

function Cell({ value, onClick, colIndex }: CellProps) {
  const isPlayable = !value && !!onClick;
  const className = clsx('cell', `col-${colIndex}`, isPlayable && 'cell--playable');

  return (
    <div className={className} onClick={isPlayable ? onClick : undefined}>
      <div className="piece">
        {value || <>&nbsp;</>}
      </div>
    </div>
  );
}
