import {
	afterAll,
	beforeAll,
	describe,
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
	2001,
	Role.Werewolf,
	2002,
] as Role[];

const room = {
	id: 0,
	ownerKey: '',
};

const me = {
	seat: 2,
	role: Role.Werewolf,
};

describe('Lone Wolf option disabled', () => {
	beforeAll(async () => {
		const res = await self.post('/room').send({ roles, random: false });
		Object.assign(room, res.body);
	});

	afterAll(async () => {
		await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
			.expect(200);
	});

	it('seats everyone', async () => {
		for (let seat = 1; seat <= 3; seat++) {
			const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('meets other werewolves', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(0);
	});

	it('cannot see one of the center cards', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill/1?seatKey=1`);
		expect(res.status).toBe(404);
		expect(res.text).toBe('Skill not found');
	});
});

describe('Lone Wolf option enabled', () => {
	beforeAll(async () => {
		const res = await self.post('/room').send({ roles, random: false, loneWolf: true });
		Object.assign(room, res.body);
	});

	afterAll(async () => {
		await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
			.expect(200);
	});

	it('seats everyone', async () => {
		for (let seat = 1; seat <= 3; seat++) {
			const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('meets other werewolves', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(0);
	});

	it('requires a card position', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill/1?seatKey=1`);
		expect(res.status).toBe(400);
		expect(res.text).toBe('Invalid skill targets');
	});

	it('rejects invalid card position', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill/1?seatKey=1`)
			.send({ cards: [4] });
		expect(res.status).toBe(400);
		expect(res.text).toBe('Invalid skill targets');
	});

	it('can see one of the center cards', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill/1?seatKey=1`)
			.send({ cards: [1] });
		expect(res.status).toBe(200);
		const { cards } = res.body as Vision;
		expect(cards).toHaveLength(1);
		expect(cards[0].role).toBe(1002);
	});
});
