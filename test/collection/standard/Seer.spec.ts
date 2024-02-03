import {
	afterAll,
	beforeAll,
	describe,
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

describe('Forecast center cards', () => {
	const roles: Role[] = new Array(26);
	roles.fill(Role.Seer, 0, 6);
	for (let i = 6; i < 26; i++) {
		roles[i] = 1000 + i;
	}

	const room = {
		id: 0,
		ownerKey: '',
	};
	beforeAll(async () => {
		const res = await self.post('/room').send({ roles });
		expect(res.status).toBe(200);
		Object.assign(room, res.body);
	});

	afterAll(async () => {
		const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
		expect(res.status).toBe(200);
	});

	const players: Player[] = [];
	const centerCards: Role[] = new Array(3);

	it('fetches all roles', async () => {
		for (let seat = 1; seat <= roles.length - 3; seat++) {
			const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
			expect(res.status).toBe(200);
			players.push(res.body);
		}
	});

	it('foresees center cards', async () => {
		let seerNum = 0;
		let a = 0;
		let b = 1;
		for (const player of players) {
			if (player.role !== Role.Seer) {
				continue;
			}
			seerNum++;

			const cards = [a, b];
			const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`).send({ cards });
			expect(res.status).toBe(200);
			const vision: Vision = res.body;
			expect(vision.cards).toHaveLength(2);
			if (centerCards[a]) {
				expect(vision.cards[0].role).toBe(centerCards[a]);
			} else {
				centerCards[a] = vision.cards[0].role;
			}
			if (centerCards[b]) {
				expect(vision.cards[1].role).toBe(centerCards[b]);
			} else {
				centerCards[b] = vision.cards[1].role;
			}

			a = (a + 1) % 3;
			b = (b + 1) % 3;
		}

		expect(seerNum).toBeGreaterThan(2);
	});

	it('checks all cards', async () => {
		const allRoles: Role[] = [
			...players.map((player) => player.role),
			...centerCards,
		];
		expect(allRoles).toHaveLength(roles.length);
		for (const role of roles) {
			expect(allRoles).toContain(role);
		}
	});
});

describe('Forecast a player', () => {
	const roles: Role[] = new Array(25);
	roles.fill(Role.Seer, 0, 5);
	for (let i = 5; i < 25; i++) {
		roles[i] = 1000 + i;
	}

	const room = {
		id: 0,
		ownerKey: '',
	};

	beforeAll(async () => {
		const res = await self.post('/room').send({ roles });
		expect(res.status).toBe(200);
		Object.assign(room, res.body);
	});

	afterAll(async () => {
		const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
		expect(res.status).toBe(200);
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

	const seers: Player[] = [];
	it('finds seers', () => {
		seers.push(...players.filter((player) => player.role === Role.Seer));
		expect(seers.length).toBeGreaterThanOrEqual(2);
	});

	it('cannot see the card of himself', async () => {
		for (const seer of seers) {
			const target = seer.seat;

			const res = await self.post(`/room/${room.id}/player/${seer.seat}/skill?seatKey=1`).send({ players: [target] });
			expect(res.status).toBe(400);
			expect(res.text).toBe('Invalid skill targets');
		}
	});

	it('foresees a player', async () => {
		for (const seer of seers) {
			let target = 0;
			do {
				target = Math.floor(Math.random() * players.length) + 1;
			} while (target === seer.seat);

			const res = await self.post(`/room/${room.id}/player/${seer.seat}/skill?seatKey=1`).send({ players: [target] });
			expect(res.status).toBe(200);
			const vision: Vision = res.body;
			expect(vision.players).toHaveLength(1);
			expect(vision.players[0].role).toBe(players[target - 1].role);
		}
	});
});
