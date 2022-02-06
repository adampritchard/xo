import { CreateRoomRes } from 'shared/types';

export class ExohApi {
  public static async createRoom(): Promise<CreateRoomRes> {
    return this.post('http://localhost:8080/room', {});
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
