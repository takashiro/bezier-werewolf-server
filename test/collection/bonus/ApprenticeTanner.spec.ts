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

import app from '../../../src/index.js';

const self = agent(app);

// Configure roles
const roles = [
	1001,
	1002,
	1003,
	Role.ApprenticeTanner,
	Role.Villager,
	Role.Robber,
	Role.Tanner,
] as Role[];

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const me: Player = {
	seat: 1,
	role: Role.ApprenticeTanner,
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

it('fetches all roles', async () => {
	for (let seat = 1; seat <= 4; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('waits for Robber', async () => {
	const res = await self.post(`/room/${room.id}/player/3/skill?seatKey=1`)
		.send({ players: [4] });
	expect(res.status).toBe(200);
});

it('still sees Tanner', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	const [player] = players;
	expect(player.seat).toBe(4);
	expect(player.role).toBe(Role.Tanner);
});
