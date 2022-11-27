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
	Room,
	Vision,
} from '@bezier/werewolf-core';
import app from '../../../src';

const self = agent(app);

// Configure roles
const roles: Role[] = [
	1001,
	1002,
	1003,
	Role.AlphaWolf,
	Role.Werewolf,
	1004,
];

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const me: Player = {
	seat: 1,
	role: Role.AlphaWolf,
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
	const players: Player[] = [];
	const playerNum = roles.length - 3;
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
		players.push(res.body);
	}
	expect(players[0].role).toBe(Role.AlphaWolf);
	expect(players[1].role).toBe(Role.Werewolf);
	expect(players[2].role).toBe(1004);
});

it('enters the room', async () => {
	const res = await self.get(`/room/${room.id}`);
	const r: Room = res.body;
	expect(r.cardNum).toBe(4);
});

it('sees other wolves', async () => {
	const res = await self.post(`/room/${room.id}/player/1/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const vision: Vision = res.body;
	const seen = vision.players;
	expect(seen).toHaveLength(1);
	expect(seen[0].seat).toBe(2);
	expect(seen[0].role).toBe(Role.Werewolf);
});

it('can be seen by other wolves', async () => {
	const res = await self.post(`/room/${room.id}/player/2/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const vision: Vision = res.body;
	const seen = vision.players;
	expect(seen).toHaveLength(1);
	expect(seen[0].seat).toBe(1);
	expect(seen[0].role).toBe(Role.AlphaWolf);
});

it('can be not seen by others', async () => {
	const res = await self.post(`/room/${room.id}/player/3/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const vision: Vision = res.body;
	expect(vision.cards).toBeUndefined();
	expect(vision.players).toBeUndefined();
});

it('rejects empty targets', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill/1?seatKey=1`);
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('rejects invalid target: self', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill/1?seatKey=1`).send({ players: [me.seat] });
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('exchanges the center werewolf card with any other player', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill/1?seatKey=1`).send({ players: [3] });
	expect(res.status).toBe(200);
});

it('votes', async () => {
	for (let seat = 1; seat <= 3; seat++) {
		await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
			.send({ target: 1 });
	}
});

it('validates exchange result', async () => {
	const res = await self.get(`/room/${room.id}/player/${me.seat}/board?seatKey=1`);
	expect(res.status).toBe(200);

	const board: Vision = res.body;

	const { players } = board;
	expect(players[0].role).toBe(Role.AlphaWolf);
	expect(players[1].role).toBe(Role.Werewolf);
	expect(players[2].role).toBe(Role.Werewolf);

	const { cards } = board;
	expect(cards).toHaveLength(4);
	expect(cards[0].role).toBe(1001);
	expect(cards[1].role).toBe(1002);
	expect(cards[2].role).toBe(1003);
	expect(cards[3].role).toBe(1004);
});
