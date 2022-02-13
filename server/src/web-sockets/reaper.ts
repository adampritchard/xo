import { WebSocketServer, WebSocket } from 'ws';

// NOTE: not using this for now because I can't test a dropped connection...

export class Reaper {
  private static connections = new Map<WebSocket, boolean>();

  public static init(server: WebSocketServer, interval: number): void {
    setInterval(() => {
      server.clients.forEach((ws) => {
        console.log('checking if connection is dead');
        if (this.isDead(ws)) {
          this.terminate(ws);
        } else {
          this.setDead(ws);
          ws.ping();
        }
      });
    }, interval);
  }

  public static watch(ws: WebSocket) {
    this.setAlive(ws);

    ws.on('pong', () => {
      console.log('connection kept alive');
      this.setAlive(ws);
    });

    ws.on('close', () => {
      this.connections.delete(ws);  
    });
  }

  private static terminate(ws: WebSocket) {
    console.log('terminating dead connection');
    this.connections.delete(ws);
    ws.terminate();
  }

  private static setAlive(ws: WebSocket) {
    this.connections.set(ws, true);
  }

  private static setDead(ws: WebSocket) {
    this.connections.set(ws, false);
  }

  private static isDead(ws: WebSocket): boolean {
    return this.connections.get(ws) === false;
  }
}
