import express from 'express';

import routerMap from './api/index.js';

const app = express();
app.use(express.json());

for (const [routerUri, router] of routerMap) {
	app.use(routerUri, router);
}

export default app;
