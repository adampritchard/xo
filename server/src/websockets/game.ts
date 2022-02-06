import { PlayerKey, GameBoard, Winner } from 'shared/types';

export class Game {
  public static isCellEmpty(board: GameBoard, row: number, col: number): boolean {
    return board[row][col] === null;
  }

  public static setCell(board: GameBoard, row: number, col: number, value: PlayerKey) : void {
    board[row][col] = value;
  }

  public static checkForWinner(board: GameBoard): Winner {
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
  
    // Check for winning line.
    for (const line of winningLines) {
      const winner = this.winnerForLine(board, line);
      if (winner) return winner;
    }

    // Check for draw.
    if (this.isBoardFull(board)) {
      return 'draw';
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

  private static isBoardFull(board: GameBoard): boolean {
    for (const row of board) {
      for (const cell of row) {
        if (!cell) return false;
      }
    }

    return true;
  }
}
