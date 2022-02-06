import { PlayerKey, GameBoard } from 'shared/types';

export class GameRules {
  public static checkForWinner(board: GameBoard): PlayerKey | null {
    const winningLines = [
      // rows.
      [[0, 0], [0, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2]],
      [[2, 0], [2, 1], [2, 2]],
  
      // cols.
      [[0, 0], [1, 0], [2, 0]],
      [[0, 1], [1, 1], [2, 1]],
      [[0, 2], [1, 2], [2, 2]],
  
      // diagonals.
      [[0, 0], [1, 1], [2, 2]],
      [[0, 2], [1, 1], [2, 0]],
    ];
  
    for (const line of winningLines) {
      const winner = this.winnerForLine(board, line);
      if (winner) return winner;
    }

    return null;
  }
  
  private static winnerForLine(board: GameBoard, line: number[][]) {
    const [aRow, aCell] = line[0];
    const [bRow, bCell] = line[1];
    const [cRow, cCell] = line[2];
  
    const a = board[aRow][aCell];
    const b = board[bRow][bCell];
    const c = board[cRow][cCell];
  
    if (a && b && c && a === b && b === c) {
      return a;
    }
  
    return null;
  }
}
