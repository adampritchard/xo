import { ClientMessage, ServerMessage } from 'shared/types';

export class UnreachableCaseError extends Error {
  constructor(value: never) {
    super(`Unreachable case: ${value}`);
  }
}

export function sendMessage(ws: WebSocket, data: ClientMessage): void {
  ws.send(JSON.stringify(data));
}

export function parseMessage(data: string): ServerMessage {
  return JSON.parse(data) as ServerMessage;
}
