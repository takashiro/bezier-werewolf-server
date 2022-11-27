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

// Configure roles
const roles: Role[] = [
	1001,
	1002,
	1003,
	Role.Robber,
	Role.Seer,
	Role.Werewolf,
];

const playerNum = roles.length - 3;
const robber = 1;
const seer = 2;

const room = {
	id: 0,
	ownerKey: '',
};
beforeAll(async () => {
	const res = await self.post('/room').send({
		random: false,
		roles,
	});
	expect(res.status).toBe(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	expect(res.status).toBe(200);
});

it('fetches all roles', async () => {
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('cannot act before seer does', async () => {
	await self.post(`/room/${room.id}/player/${robber}/skill?seatKey=1`).send({})
		.expect(425, 'Skill not ready');
});

it('cannot be seen by seer', async () => {
	const res = await self.post(`/room/${room.id}/player/${seer}/skill?seatKey=1`).send({
		players: [1],
	});
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	expect(players[0].role).toBe(Role.Robber);
});

it('validates user input', async () => {
	const skillApi = `/room/${room.id}/player/${robber}/skill?seatKey=1`;

	// Validate user input
	await self.post(skillApi).send({})
		.expect(400, 'Invalid skill targets');

	// Non-existing target
	await self.post(skillApi).send({ players: [playerNum + 1] })
		.expect(400, 'Invalid skill targets');

	// Disallow robbing oneself
	await self.post(skillApi).send({ players: [robber] })
		.expect(400, 'Invalid skill targets');
});

it('rob a werewolf', async () => {
	const res = await self.post(`/room/${room.id}/player/${robber}/skill?seatKey=1`).send({
		players: [3],
	});
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	const [wolf] = players;
	expect(wolf.role).toBe(Role.Werewolf);
	expect(wolf.seat).toBe(3);
});

it('gets ready', async () => {
	const res = await self.post(`/room/${room.id}/player/3/skill?seatKey=1`);
	expect(res.status).toBe(200);
});

it('votes', async () => {
	for (let seat = 1; seat <= 3; seat++) {
		const res = await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`).send({
			target: 1,
		});
		expect(res.status).toBe(200);
	}
});

it('checkes roles', async () => {
	const res = await self.get(`/room/${room.id}/player/1/lynch?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(3);
	expect(players[0].role).toBe(Role.Werewolf);
	expect(players[1].role).toBe(Role.Seer);
	expect(players[2].role).toBe(Role.Robber);
});
