import React from 'react';
import { PlayerKey } from 'shared/types';

type WinnerProps = {
  player: PlayerKey | null,
  winner: PlayerKey | null,
};

export function Winner({ player, winner }: WinnerProps) {
  if (player === winner) return <h2>You Win!</h2>;
  return <h2>You Lose...</h2>;
}
