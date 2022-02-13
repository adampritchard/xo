import { CreateRoomRes } from 'shared/types';

export class XoApi {
  public static async createRoom(): Promise<CreateRoomRes> {
    return this.post('/api/room', {});
  }

  private static async post(url: string, data: any) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    return response.json();
  }
}
