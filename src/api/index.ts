import { Router } from 'express';

import roomRouter from './room/index.js';
import statusRouter from './status.js';

const routerMap = new Map<string, Router>();
routerMap.set('/room', roomRouter);
routerMap.set('/status', statusRouter);

export default routerMap;
