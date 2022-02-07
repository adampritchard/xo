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
    <div className="start-page">
      <h1 className="logo">exoh</h1>

      <button onClick={onPressStart}>
        New Game
      </button>
    </div>
  );
}
