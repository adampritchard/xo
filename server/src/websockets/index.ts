import { Server } from 'http';
import { WebSocketServer } from 'ws';
import { parseMessage } from './utils';
import { Rooms } from './rooms';

type InitParams = { server: Server };

export function initWebSockets({ server }: InitParams) {
  const wsServer = new WebSocketServer({ server });

  wsServer.on('connection', (ws, req) => {
    console.log('new connection');

    ws.on('message', (buffer) => {
      const data = parseMessage(buffer);

      if (data.type === 'join-room') {
        console.log('trying to join room', data.roomId);
        Rooms.join(ws, data.roomId);
      }
    });
  });
}
