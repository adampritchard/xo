import React from 'react';
import { PlayerKey } from 'shared/types';

type PlayerHeadingProps = {
  player: PlayerKey | null,
};

export function PlayerHeading({ player }: PlayerHeadingProps) {
  function getHeadingText() {
    if (player === null) return 'You are not playing :(';
    if (player === 'o') return 'You are o';
    if (player === 'x') return 'You are x';
  }

  return <h3>{getHeadingText()}</h3>
}
