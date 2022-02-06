import { WebSocket } from 'ws';
import { sendMessage, randomLetter } from './utils';
import { Room } from './room';

export class Rooms {
  private static rooms = new Map<string, Room>();

  public static create() {
    const roomId = this.generateId();
    this.rooms.set(roomId, new Room(roomId));

    // TODO: set a timeout on the room...
    //       maybe set an 'expiryTimestamp' on the room or something?

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
