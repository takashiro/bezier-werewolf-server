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
	Role.Seer,
	Role.ApprenticeSeer,
	Role.Beholder,
	Role.Troublemaker,
	Role.Werewolf,
] as Role[];

const seer = 1;
const apprenticeSeer = 2;
const beholder = 3;
const troublemaker = 4;

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const me: Player = {
	seat: beholder,
	role: Role.Beholder,
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

it('cannot act too early', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
	expect(res.status).toBe(425);
});

it('waits for Apprentice Seer', async () => {
	const res = await self.post(`/room/${room.id}/player/${apprenticeSeer}/skill?seatKey=1`)
		.send({ cards: [0] });
	expect(res.status).toBe(200);
});

it('waits for Seer', async () => {
	const res = await self.post(`/room/${room.id}/player/${seer}/skill?seatKey=1`)
		.send({ cards: [1, 2] });
	expect(res.status).toBe(200);
});

it('waits for Troublemaker', async () => {
	const res = await self.post(`/room/${room.id}/player/${troublemaker}/skill?seatKey=1`)
		.send({ players: [2, 5] });
	expect(res.status).toBe(200);
});

it('sees Seer and Werewolf', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(2);
	expect(players[0].seat).toBe(1);
	expect(players[0].role).toBe(Role.Seer);
	expect(players[1].seat).toBe(2);
	expect(players[1].role).toBe(Role.Werewolf);
});
