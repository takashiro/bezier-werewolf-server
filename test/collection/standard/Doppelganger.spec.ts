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

import app from '../../../src';

const self = agent(app);

const roles: Role[] = [
	2001,
	2002,
	2003,
	Role.Doppelganger,
	Role.AlphaWolf,
	1003,
	1004,
	Role.Werewolf,
];
const room = {
	id: 0,
	ownerKey: '',
};

beforeAll(async () => {
	const res = await self.post('/room').send({ roles, random: false })
		.expect(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200);
});

it('fetch all roles', async () => {
	for (let seat = 1; seat <= 5; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('should wake up earlier than Alpha Wolf', async () => {
	const res = await self.post(`/room/${room.id}/player/2/skill?seatKey=1`);
	expect(res.status).toBe(425);
});

it('rejects invalid target', async () => {
	const res = await self.post(`/room/${room.id}/player/1/skill?seatKey=1`)
		.send({ cards: [1] });
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('copies Alpha Wolf', async () => {
	const res = await self.post(`/room/${room.id}/player/1/skill?seatKey=1`)
		.send({ players: [2] });
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	const [wolf] = players;
	expect(wolf.seat).toBe(2);
	expect(wolf.role).toBe(Role.AlphaWolf);
});

it('meets other werewolves', async () => {
	const res = await self.post(`/room/${room.id}/player/1/skill/1?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(2);
	expect(players[0].seat).toBe(2);
	expect(players[0].role).toBe(Role.AlphaWolf);
	expect(players[1].seat).toBe(5);
	expect(players[1].role).toBe(Role.Werewolf);
});

it('can be seen by Alpha Wolf', async () => {
	const res = await self.post(`/room/${room.id}/player/2/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(2);
	expect(players[0].seat).toBe(1);
	expect(players[0].role).toBe(Role.AlphaWolf);
	expect(players[1].seat).toBe(5);
	expect(players[1].role).toBe(Role.Werewolf);
});

it('can be seen by Werewolf', async () => {
	const res = await self.post(`/room/${room.id}/player/5/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(2);
	expect(players[0].seat).toBe(1);
	expect(players[0].role).toBe(Role.AlphaWolf);
	expect(players[1].seat).toBe(2);
	expect(players[1].role).toBe(Role.AlphaWolf);
});

it('infects Player 3', async () => {
	const res = await self.post(`/room/${room.id}/player/1/skill/2?seatKey=1`)
		.send({ players: [3] });
	expect(res.status).toBe(200);
});

it('infects Player 4', async () => {
	const res = await self.post(`/room/${room.id}/player/2/skill/1?seatKey=1`)
		.send({ players: [4] });
	expect(res.status).toBe(200);
});

it('gets ready', async () => {
	for (let seat = 3; seat <= 4; seat++) {
		const res = await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('votes', async () => {
	for (let seat = 1; seat <= 5; seat++) {
		const res = await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
			.send({ target: 3 });
		expect(res.status).toBe(200);
	}
});

it('validates exchange result', async () => {
	const res = await self.get(`/room/${room.id}/player/1/board?seatKey=1`);
	expect(res.status).toBe(200);

	const {
		cards,
		players,
	} = res.body as Vision;

	expect(players[0].role).toBe(Role.AlphaWolf);
	expect(players[1].role).toBe(Role.AlphaWolf);
	expect(players[2].role).toBe(Role.Werewolf);
	expect(players[3].role).toBe(1003);
	expect(players[4].role).toBe(Role.Werewolf);

	expect(cards).toHaveLength(4);
	expect(cards[0].role).toBe(2001);
	expect(cards[1].role).toBe(2002);
	expect(cards[2].role).toBe(2003);
	expect(cards[3].role).toBe(1004);
});
