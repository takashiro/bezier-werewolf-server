import {
	Player,
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';

import app from '../../../src';

const self = agent(app);

const roles: Role[] = [];
const room = {
	id: 0,
	ownerKey: '',
};
const players: Player[] = [];
const drunks: Player[] = [];
const centerCards: Role[] = [Role.Unknown, Role.Unknown, Role.Unknown];

beforeAll(async () => {
	// Configure roles
	for (let i = 0; i < 4; i++) {
		roles.push(Role.Drunk);
	}
	for (let i = 0; i < 6; i++) {
		roles.push(Role.Seer);
	}
	for (let i = 1000; i <= 1020; i++) {
		roles.push(i);
	}

	// Create a room
	const res = await self.post('/room').send({ roles })
		.expect(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200);
});

it('fetches roles', async () => {
	const playerNum = roles.length - 3;
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		players.push(res.body);
	}
	drunks.push(...players.filter((player) => player.role === Role.Drunk));
});

it('validate user input', async () => {
	await self.post(`/room/${room.id}/player/${drunks[0].seat}/skill?seatKey=1`)
		.expect(400, 'Invalid skill targets');
});

it('filters non-existing targets', async () => {
	await self.post(`/room/${room.id}/player/${drunks[0].seat}/skill?seatKey=1`)
		.send({ cards: [3] })
		.expect(400, 'Invalid skill targets');
	await self.post(`/room/${room.id}/player/${drunks[0].seat}/skill?seatKey=1`)
		.send({ cards: [-1] })
		.expect(400, 'Invalid skill targets');
});

it('gets ready', async () => {
	for (const player of players) {
		if (player.role < 1000) {
			continue;
		}

		const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('checkes center cards', async () => {
	const seers = players.filter((player) => player.role === Role.Seer);
	let sel = 0;
	for (const seer of seers) {
		const res = await self.post(`/room/${room.id}/player/${seer.seat}/skill?seatKey=1`)
			.send({ cards: [sel, (sel + 1) % 3] })
			.expect(200);
		sel = (sel + 2) % 3;
		const vision: Vision = res.body;
		const { cards } = vision;
		expect(cards).toHaveLength(2);
		for (const card of cards) {
			const baseline = centerCards[card.pos];
			if (baseline) {
				expect(baseline).toBe(card.role);
			} else {
				centerCards[card.pos] = card.role;
			}
		}
	}
});

it('exchanges the card with a center card', async () => {
	for (const drunk of drunks) {
		const card = Math.floor(Math.random() * 3);
		await self.post(`/room/${room.id}/player/${drunk.seat}/skill?seatKey=1`)
			.send({ cards: [card] })
			.expect(200);
		const from = centerCards[card];
		drunk.role = from;
		centerCards[card] = Role.Drunk;
	}
});

it('reveals all roles', async () => {
	for (const player of players) {
		const res = await self.post(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`)
			.send({ target: 1 });
		expect(res.status).toBe(200);
	}

	for (const player of players) {
		const res = await self.get(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`);
		const board: Vision = res.body;
		expect(board.cards).toHaveLength(3);
		expect(board.cards.map((card) => card.role)).toStrictEqual(centerCards);
		for (const p of board.players) {
			const b = players[p.seat - 1];
			expect(p.role).toBe(b.role);
		}
	}
});
