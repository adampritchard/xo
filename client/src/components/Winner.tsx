import React from 'react';
import { PlayerKey, Winner } from 'shared/types';

type WinnerProps = {
  player: PlayerKey | null,
  winner: Winner,
};

export function Winner({ player, winner }: WinnerProps) {
  if (winner === 'draw') return <h3>Draw...</h3>;
  if (player === winner) return <h3>You Win!</h3>;
  return <h3>You Lose :(</h3>;
}
