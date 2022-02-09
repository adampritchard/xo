import React from 'react';
import { useNavigate } from 'react-router-dom';
import { XoApi } from 'utils/XoApi';

export function useStartNewGame() {
  const navigate = useNavigate();

  const startNewGame = React.useCallback(async () => {
    const result = await XoApi.createRoom();
    if (result.roomId) {
      navigate(`/${result.roomId}`);
    } else {
      // TODO: return errors...
    }
  }, []);

  return startNewGame;
}
