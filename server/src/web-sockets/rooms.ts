import { WebSocket } from 'ws';
import ms from 'ms';
import { sendMessage, randomLetter } from './utils';
import { Room } from './room';

export class Rooms {
  private static rooms = new Map<string, Room>();

  public static create() {
    const roomId = this.generateId();
    const expiry = ms('10min');

    const room = new Room(roomId, expiry);
    this.rooms.set(roomId, room);

    setTimeout(() => {
      room.close();
      this.rooms.delete(roomId);
    }, expiry);

    return roomId;
  }

  public static join(ws: WebSocket, roomId: string) {
    const room = this.rooms.get(roomId);

    if (room) {
      room.join(ws);
    } else {
      sendMessage(ws, {
        type: 'room-not-found',
        roomId,
      });
    }
  }

  private static generateId(): string {
    return randomLetter() + randomLetter() + randomLetter() + randomLetter();
  } 
}
