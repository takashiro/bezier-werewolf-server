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
	Role.Seer,
	Role.Drunk,
	Role.Villager,
];

const seer = 1;
const drunk = 2;

const room = {
	id: 0,
	ownerKey: '',
};

beforeAll(async () => {
	// Create a room
	const res = await self.post('/room').send({
		random: false,
		roles,
	});
	expect(res.status).toBe(200);
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
		expect(res.status).toBe(200);
	}
});

it('cannot act before seer does', async () => {
	await self.post(`/room/${room.id}/player/${drunk}/skill?seatKey=1`)
		.expect(425, 'Skill not ready');
});

it('cannot be seen by seer', async () => {
	const res = await self.post(`/room/${room.id}/player/${seer}/skill?seatKey=1`).send({
		players: [drunk],
	});
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players[0].role).toBe(Role.Drunk);
});

it('validate user input', async () => {
	await self.post(`/room/${room.id}/player/${drunk}/skill?seatKey=1`)
		.expect(400, 'Invalid skill targets');
});

it('filters non-existing targets', async () => {
	await self.post(`/room/${room.id}/player/${drunk}/skill?seatKey=1`)
		.send({ cards: [3] })
		.expect(400, 'Invalid skill targets');
	await self.post(`/room/${room.id}/player/${drunk}/skill?seatKey=1`)
		.send({ cards: [-1] })
		.expect(400, 'Invalid skill targets');
});

it('gets ready', async () => {
	const res = await self.post(`/room/${room.id}/player/3/skill?seatKey=1`);
	expect(res.status).toBe(200);
});

it('exchanges the card with a center card', async () => {
	const res = await self.post(`/room/${room.id}/player/${drunk}/skill?seatKey=1`)
		.send({ cards: [2] });
	expect(res.status).toBe(200);
	const { cards, players } = res.body as Vision;
	expect(cards).toBeUndefined();
	expect(players).toBeUndefined();
});

it('reveals all roles', async () => {
	for (let seat = 1; seat <= 3; seat++) {
		const res = await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
			.send({ target: 1 });
		expect(res.status).toBe(200);
	}

	for (let seat = 1; seat <= 3; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/lynch?seatKey=1`);
		const { cards, players } = res.body as Vision;
		expect(cards).toHaveLength(3);
		expect(cards[0].role).toBe(1001);
		expect(cards[1].role).toBe(1002);
		expect(cards[2].role).toBe(Role.Drunk);
		expect(players[0].role).toBe(Role.Seer);
		expect(players[1].role).toBe(1003);
		expect(players[2].role).toBe(Role.Villager);
	}
});
