export function createRoom() {
  const roomId = generateRoomId();
  return roomId;
}

function generateRoomId() {
  return randomLetter() + randomLetter() + randomLetter() + randomLetter();
}

function randomLetter(): string {
  const n = randomNumberBetween(65, 90);
  return String.fromCharCode(n);
}

function randomNumberBetween(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}
