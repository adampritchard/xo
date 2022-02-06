import React from 'react';
import { PlayerKey, Winner } from 'shared/types';

type WinnerProps = {
  player: PlayerKey | null,
  winner: Winner,
};

export function Winner({ player, winner }: WinnerProps) {
  if (winner === 'draw') return <h2>Draw...</h2>;
  if (player === winner) return <h2>You Win!</h2>;
  return <h2>You Lose :(</h2>;
}
