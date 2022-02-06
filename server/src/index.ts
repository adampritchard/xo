import { initWebSocketServer } from './websockets';
import { initApiServer } from './api';

initWebSocketServer({ port: 8082 });
initApiServer({ port: 8080 });
