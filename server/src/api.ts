import express from 'express';
import { incrementPingCounter } from './ping';

type InitParams = { port: number };

export function initApiServer({ port }: InitParams) {
  const api = express();

  api.get('/', (req, res) => {
    res.json({ msg: 'Hello, world!' });
  });

  api.get('/ping', (req, res) => {
    const count = incrementPingCounter();
    res.json({ pingCount: count });
  });

  api.listen(port, () => {
    console.log(`api server listening on port ${port}`);
  });
}
