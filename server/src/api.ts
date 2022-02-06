import express, { Response } from 'express';
import cors from 'cors';
import { CreateRoomRes } from 'shared/types';
import { incrementPingCounter } from './ping';
import { createRoom } from './rooms';

type InitParams = { port: number };

export function initApiServer({ port }: InitParams) {
  const api = express();
  api.use(cors());

  api.get('/', (req, res) => {
    res.json({ msg: 'Hello, world!' });
  });

  api.get('/ping', (req, res) => {
    const count = incrementPingCounter();
    res.json({ pingCount: count });
  });

  api.post('/room', (req, res: Response<CreateRoomRes>) => {
    const roomId = createRoom();
    res.json({ roomId });
  });

  api.listen(port, () => {
    console.log(`api server listening on port ${port}`);
  });
}
