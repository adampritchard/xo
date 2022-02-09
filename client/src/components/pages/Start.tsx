import { useNavigate } from 'react-router-dom';
import { XoApi } from 'utils/XoApi';

export function Start() {
  const navigate = useNavigate();

  const onPressStart = async () => {
    const result = await XoApi.createRoom();
    if (result.roomId) {
      navigate(result.roomId);
    } else {
      // TODO: show an error...
    }
  };

  return (
    <div className="start-page">
      <h1 className="logo">xo</h1>

      <button onClick={onPressStart}>
        New Game
      </button>
    </div>
  );
}
