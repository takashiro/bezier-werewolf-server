import { it } from '@jest/globals';
import supertest from 'supertest';
import app from '../../src/index.js';

const agent = supertest.agent(app);

it('returns lobby status', async () => {
	await agent.get('/status')
		.expect(200, {
			roomNum: 0,
			capacity: 1000,
		});
});
