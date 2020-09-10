import * as express from 'express';

import routerMap from './api';

const app = express();
app.use(express.json());

for (const [routerUri, router] of routerMap) {
	app.use(routerUri, router);
}

export default app;
