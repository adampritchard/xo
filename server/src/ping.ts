type CountChangedHandler = (count: number) => void;

let pingCount = 0;

const handlers: CountChangedHandler[] = [];

export function incrementPingCounter() {
  pingCount++;

  for (const handler of handlers) {
    handler(pingCount);
  }

  return pingCount;
}

export function onPingCountChanged(eventHandler: CountChangedHandler) {
  handlers.push(eventHandler);
}
