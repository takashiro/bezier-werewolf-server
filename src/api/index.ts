import { Router } from 'express';

import statusRouter from './status';

const routerMap = new Map<string, Router>();
routerMap.set('/status', statusRouter);

export default routerMap;
