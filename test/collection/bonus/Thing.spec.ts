import {
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';

import app from '../../../src';

const self = agent(app);

const roles: Role[] = [
	1001,
	1002,
	1003,
	Role.Thing,
	Role.Villager,
	Role.Villager,
	Role.Villager,
];

const room = {
	id: 0,
	ownerKey: '',
};

const thing = 1;
const tapped = 4;

beforeAll(async () => {
	const res = await self.post('/room').send({
		roles,
		random: false,
	});
	expect(res.status).toBe(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	expect(res.status).toBe(200);
});

it('takes all seats', async () => {
	for (let seat = 1; seat <= 4; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('wakes up villagers', async () => {
	for (let seat = 2; seat <= 4; seat++) {
		const res = await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('blocks day phase', async () => {
	const res = await self.get(`/room/${room.id}/player/${tapped}/board?seatKey=1`);
	expect(res.status).toBe(425);
});

it('cannot tap anyone remote from him', async () => {
	const res = await self.post(`/room/${room.id}/player/${thing}/skill?seatKey=1`).send({
		players: [3],
	});
	expect(res.status).toBe(400);
});

it(`taps Player ${tapped}`, async () => {
	const res = await self.post(`/room/${room.id}/player/${thing}/skill?seatKey=1`).send({
		players: [tapped],
	});
	expect(res.status).toBe(200);
});

it(`is disclosed to Player ${tapped}`, async () => {
	const res = await self.get(`/room/${room.id}/player/${tapped}/board?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	const [a] = players;
	expect(a.role).toBe(Role.Thing);
	expect(a.seat).toBe(thing);
});

it('is not disclosed to Player 2', async () => {
	const res = await self.get(`/room/${room.id}/player/2/board?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(0);
});
