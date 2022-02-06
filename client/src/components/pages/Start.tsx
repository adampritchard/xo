export function Start() {
  const onPressStart = () => {
    console.log('start game??');
  };

  return (
    <div>
      <h1>exoh</h1>
      
      <div>
        <button onClick={onPressStart}>
          Start Game
        </button>
      </div>
    </div>
  );
}
