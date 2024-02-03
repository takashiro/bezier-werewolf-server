import {
	afterAll,
	beforeAll,
	expect,
	it,
} from '@jest/globals';
import { agent } from 'supertest';

import {
	Role,
	Vision,
} from '@bezier/werewolf-core';

import app from '../../../src/index.js';

const self = agent(app);

const roles = [
	1001,
	1002,
	1003,
	Role.Thing,
	Role.Robber,
	Role.Villager,
	Role.Prince,
] as Role[];

const room = {
	id: 0,
	ownerKey: '',
};

const thing = 1;
const robber = 2;
const villager = 3;
const prince = 4;

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

it('blocks night phase of robber', async () => {
	const res = await self.get(`/room/${room.id}/player/${robber}/board?seatKey=1`);
	expect(res.status).toBe(425);
});

it('does not block night phase of villager', async () => {
	await self.get(`/room/${room.id}/player/${villager}/board?seatKey=1`)
		.expect(200, {});
});

it('cannot tap anyone remote from him', async () => {
	const res = await self.post(`/room/${room.id}/player/${thing}/skill?seatKey=1`).send({
		players: [villager],
	});
	expect(res.status).toBe(400);
});

it('taps Prince', async () => {
	const res = await self.post(`/room/${room.id}/player/${thing}/skill?seatKey=1`).send({
		players: [prince],
	});
	expect(res.status).toBe(200);
});

it('is not disclosed to Prince at night', async () => {
	await self.get(`/room/${room.id}/player/${prince}/board?seatKey=1`)
		.expect(200, {});
});

it('idles while Prince gets ready', async () => {
	await self.post(`/room/${room.id}/player/${prince}/skill?seatKey=1`)
		.expect(200);
});

it('prevents Prince from waking up', async () => {
	await self.get(`/room/${room.id}/player/${prince}/board?seatKey=1`)
		.expect(425, 'Other players are still invoking their skills.');
});

it('is not disclosed to villager', async () => {
	await self.get(`/room/${room.id}/player/${villager}/board?seatKey=1`)
		.expect(200, {});
});

it('is not disclosed to robber', async () => {
	const empty: Vision = {
		players: [],
		cards: [],
	};
	await self.get(`/room/${room.id}/player/${robber}/board?seatKey=1`)
		.expect(200, empty);
});

it('idles while Robber is robbing someone else', async () => {
	await self.post(`/room/${room.id}/player/${robber}/skill?seatKey=1`)
		.send({ players: [prince] })
		.expect(200);
});

it('idles while Villager is getting ready', async () => {
	await self.post(`/room/${room.id}/player/${villager}/skill?seatKey=1`)
		.expect(200);
});

it('is disclosed to Prince during the day', async () => {
	const res = await self.get(`/room/${room.id}/player/${prince}/board?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	expect(players[0]).toStrictEqual({
		role: Role.Thing,
		seat: thing,
	});
});
