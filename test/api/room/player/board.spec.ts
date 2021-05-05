import { agent } from 'supertest';

import app from '../../../../src';

const self = agent(app);

it('rejects invalid room id', async () => {
	await self.get('/room/abc/player/1/board?seatKey=1')
		.expect(400, 'Invalid room id');
});
