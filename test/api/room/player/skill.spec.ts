import {
	afterAll,
	beforeAll,
	expect,
	it,
} from '@jest/globals';
import { agent } from 'supertest';
import {
	Player,
	Role,
} from '@bezier/werewolf-core';

import app from '../../../../src';

const self = agent(app);

const roles: Role[] = new Array(5);
roles.fill(Role.Villager);

const room = {
	id: 0,
	salt: '',
	ownerKey: '',
	cardNum: 3,
	roles: [],
};

beforeAll(async () => {
	const res = await self.post('/room').send({ roles });
	Object.assign(room, res.body);
});

afterAll(async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200);
});

it('rejects invalid room id', async () => {
	await self.post('/room/0/player/1/skill?seatKey=1')
		.expect(400, 'Invalid room id');

	await self.post('/room/xyz/player/1/skill?seatKey=1')
		.expect(400, 'Invalid room id');
});

it('rejects invalid seat number', async () => {
	await self.post(`/room/${room.id}/player/abc/skill?seatKey=1`)
		.expect(400, 'Invalid seat number');
});

it('rejects empty seat key', async () => {
	await self.post(`/room/${room.id}/player/1/skill`)
		.expect(401, 'Seat key cannot be empty');
});

it('rejects untaken seat', async () => {
	await self.post(`/room/${room.id}/player/1/skill?seatKey=1`)
		.expect(403, 'The seat has not been taken');
});

it('rejects non-existing seat', async () => {
	await self.post(`/room/${room.id}/player/1000/skill?seatKey=1`)
		.expect(404, 'The seat does not exist');
});

const players: Player[] = [];
it('fetches all roles', async () => {
	const playerNum = roles.length - 3;
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
		players.push(res.body);
	}
});

it('rejects incorrect seat key', async () => {
	await self.post(`/room/${room.id}/player/1/skill?seatKey=bab`)
		.expect(403, 'Invalid seat key');
});
