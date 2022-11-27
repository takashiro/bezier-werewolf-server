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
	Vision,
} from '@bezier/werewolf-core';

import app from '../../../src';

const self = agent(app);

// Configure roles
const roles: Role[] = [
	1001,
	1002,
	1003,
	Role.Robber,
	Role.Insomniac,
];

const room = {
	id: 0,
	ownerKey: '',
};
beforeAll(async () => {
	const res = await self.post('/room').send({ roles, random: false });
	expect(res.status).toBe(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	expect(res.status).toBe(200);
});

it('seats Robber', async () => {
	const res = await self.get(`/room/${room.id}/player/1/seat?seatKey=1`);
	expect(res.status).toBe(200);
	const player: Player = res.body;
	expect(player.role).toBe(Role.Robber);
});

it('seats Insomniac', async () => {
	const res = await self.get(`/room/${room.id}/player/2/seat?seatKey=1`);
	expect(res.status).toBe(200);
	const player: Player = res.body;
	expect(player.role).toBe(Role.Insomniac);
});

it('robs Insomniac', async () => {
	const res = await self.post(`/room/${room.id}/player/1/skill?seatKey=1`)
		.send({ players: [2] });
	expect(res.status).toBe(200);
	const vision: Vision = res.body;
	const [player] = vision.players;
	expect(player.role).toBe(Role.Insomniac);
	expect(player.seat).toBe(2);
});

it('sees the final role of Insomniac', async () => {
	const res = await self.post(`/room/${room.id}/player/2/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const vision: Vision = res.body;
	const [player] = vision.players;
	expect(player.role).toBe(Role.Robber);
	expect(player.seat).toBe(2);
});
