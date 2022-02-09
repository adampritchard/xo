import { RoomStatus, StringMap } from 'shared/types';
import { useStartNewGame } from 'hooks';

type NoRoomProps = {
  status: RoomStatus,
};

const headings: StringMap = {
  'room-closed': 'This Room is Now Closed',
  'room-full': 'Sorry, This Room is Full',
  'room-not-found': 'Room Not Found',
};

export function NoRoom({ status }: NoRoomProps) {
  const startNewGame = useStartNewGame();

  return (
    <div className="no-room-page">
      <h1>{headings[status] || ''}</h1>

      <button onClick={startNewGame}>
        New Game
      </button>
    </div>
  );
}
