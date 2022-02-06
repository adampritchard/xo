import { useNavigate } from 'react-router-dom';
import { ExohApi } from 'utils/ExohApi';

export function Start() {
  const navigate = useNavigate();

  const onPressStart = async () => {
    const result = await ExohApi.createRoom();
    if (result.roomId) {
      navigate(result.roomId);
    } else {
      // TODO: show an error...
    }
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
