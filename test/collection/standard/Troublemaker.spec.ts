import {
	Player,
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';
import app from '../../../src';

const self = agent(app);

const roles = [];
const room = {
	id: 0,
	ownerKey: '',
};
const players: Player[] = [];
const exchanges: [number, number][] = [];

beforeAll(async () => {
	for (let i = 0; i < 4; i++) {
		roles.push(Role.Troublemaker);
	}
	for (let i = 0; i < 20; i++) {
		roles.push(1000 + i);
	}

	// Create a room
	const res = await self.post('/room').send({ roles });
	expect(res.status).toBe(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	expect(res.status).toBe(200);
});

it('fetches all roles', async () => {
	const playerNum = roles.length - 3;
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
		players.push(res.body);
	}
});

it('exchanges the cards of 2 players', async () => {
	for (let seat = 1; seat <= players.length; seat++) {
		const player = players[seat - 1];
		if (player.role !== Role.Troublemaker) {
			continue;
		}

		const skillApi = `/room/${room.id}/player/${seat}/skill?seatKey=1`;

		await self.post(skillApi).send({ players: [1, 1] })
			.expect(400, 'Invalid skill targets');

		await self.post(skillApi).send({ players: [1, seat] })
			.expect(400, 'Invalid skill targets');

		let exchange: [number, number];
		do {
			exchange = [
				Math.floor(Math.random() * players.length) + 1,
				Math.floor(Math.random() * players.length) + 1,
			];
		} while (exchange[0] === exchange[1] || exchange.some((t) => t === seat));
		const res = await self.post(skillApi).send({ players: exchange });
		expect(res.status).toBe(200);
		exchanges.push(exchange);
	}
});

it('gets ready and votes', async () => {
	await Promise.all(players.map(async (player) => {
		await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
	}));

	await Promise.all(players.map(async (player) => {
		await self.post(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`)
			.send({ target: 1 });
	}));
});

it('calculates the expected result', () => {
	expect(exchanges.length).toBeGreaterThan(0);
	for (const exchange of exchanges) {
		const from = players[exchange[0] - 1];
		const to = players[exchange[1] - 1];
		const fromRole = from.role;
		const toRole = to.role;
		from.role = toRole;
		to.role = fromRole;
	}
});

it('checkes roles', async () => {
	await Promise.all(players.map(async (player) => {
		const res = await self.get(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`);
		expect(res.status).toBe(200);
		const board: Vision = res.body;

		expect(board.players).toBeTruthy();
		for (const p of board.players) {
			const baseline = players[p.seat - 1];
			expect(baseline.role).toBe(p.role);
		}
	}));
});
