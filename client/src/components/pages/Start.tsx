import { useStartNewGame } from 'hooks';

export function Start() {
  const startNewGame = useStartNewGame();

  return (
    <div className="start-page">
      <h1 className="logo">xo</h1>

      <button onClick={startNewGame}>
        New Game
      </button>
    </div>
  );
}
