import { Router } from 'express';

import roomRouter from './room';
import statusRouter from './status';

const routerMap = new Map<string, Router>();
routerMap.set('/room', roomRouter);
routerMap.set('/status', statusRouter);

export default routerMap;
