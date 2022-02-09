import express, { Response } from 'express';
import cors from 'cors';
import { CreateRoomRes } from 'shared/types';
import { Rooms } from '../websockets/rooms';

type InitParams = { port: number };

export function initApiServer({ port }: InitParams) {
  const api = express();
  api.use(cors());

  api.get('/', (req, res) => {
    res.json({ msg: 'Hello, xo!' });
  });

  api.post('/room', (req, res: Response<CreateRoomRes>) => {
    const roomId = Rooms.create();
    res.json({ roomId });
  });

  api.listen(port, () => {
    console.log(`api server listening on port ${port}`);
  });
}
