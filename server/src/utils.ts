import { WebSocket, RawData } from 'ws';
import { ServerMessage, ClientMessage } from 'shared/types';

export function sendMessage(ws: WebSocket, data: ServerMessage): void {
  ws.send(JSON.stringify(data));
}

export function parseMessage(buffer: RawData): ClientMessage {
  return JSON.parse(buffer.toString()) as ClientMessage;
}

export function randomLetter(): string {
  const n = randomNumberBetween(65, 90);
  return String.fromCharCode(n);
}

export function randomNumberBetween(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}
