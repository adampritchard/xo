import { WebSocketServer } from 'ws';
import { parseMessage } from './utils';
import { Rooms } from './rooms';

type InitParams = { port: number };

export function initWebSocketServer({ port }: InitParams) {
  const server = new WebSocketServer({ port });

  console.log(`web socket server listening on port ${port}`);

  server.on('connection', (ws, req) => {
    console.log('new connection');

    ws.on('message', (buffer) => {
      const data = parseMessage(buffer);

      if (data.type === 'join-room') {
        console.log('trying to join room', data.roomId);
        Rooms.join(ws, data.roomId);
      }
    });
  });

  return server;
}
