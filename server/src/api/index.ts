import { Express, Response } from 'express';
import { CreateRoomRes } from 'shared/types';
import { Rooms } from '../web-sockets/rooms';

type InitParams = { app: Express };

export function initApi({ app }: InitParams) {
  app.get('/api', (req, res) => {
    res.json({ msg: 'Hello, xo api!' });
  });

  app.post('/api/room', (req, res: Response<CreateRoomRes>) => {
    const roomId = Rooms.create();
    res.json({ roomId });
  });
}
