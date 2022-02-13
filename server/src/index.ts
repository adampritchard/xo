import http from 'http';
import express from 'express';
import cors from 'cors';
import { initApi } from './api';
import { initWebSockets } from './websockets';

const port = 8080;

const app = express();
app.use(cors());

const server = http.createServer(app);

initApi({ app });
initWebSockets({ server });

server.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
