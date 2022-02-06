import express from 'express';

type InitParams = { port: number };

export function initApiServer({ port }: InitParams) {
  const api = express();

  api.get('/', (req, res) => {
    res.json({ msg: 'Hello, world!' });
  });

  api.listen(port, () => {
    console.log(`api server listening on port ${port}`);
  });
}
