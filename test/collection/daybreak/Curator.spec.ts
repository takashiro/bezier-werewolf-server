import {
	afterAll,
	beforeAll,
	expect,
	it,
} from '@jest/globals';
import { agent } from 'supertest';

import {
	Artifact,
	Player,
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
	Role.Curator,
	1004,
	1005,
];

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const me = 1;

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

it('fetches all roles', async () => {
	for (let seat = 1; seat <= 3; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
		const { role } = res.body as Player;
		expect(role).toBe(roles[2 + seat]);
	}
});

it('rejects empty targets', async () => {
	const res = await self.post(`/room/${room.id}/player/${me}/skill?seatKey=1`);
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('places a random artifact on a player', async () => {
	const res = await self.post(`/room/${room.id}/player/${me}/skill?seatKey=1`).send({
		players: [2],
	});
	expect(res.status).toBe(200);
});

it('gets everyone ready', async () => {
	for (let seat = 2; seat <= 3; seat++) {
		const res = await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('does not reveal the artifact token to all', async () => {
	const res = await self.get(`/room/${room.id}/player/${me}/board?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	const [victim] = players;
	expect(victim.seat).toBe(2);
	expect(victim.role).toBe(Role.Unknown);
	expect(victim.artifacts).toHaveLength(1);
	expect(victim.artifacts).toContain(Artifact.Unknown);
});

it('reveals the artifact token to its owner only', async () => {
	const res = await self.get(`/room/${room.id}/player/2/board?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	const [victim] = players;
	expect(victim.seat).toBe(2);
	expect(victim.role).toBe(Role.Unknown);
	expect(victim.artifacts).toHaveLength(1);
	expect(victim.artifacts[0]).toBeGreaterThan(Artifact.Unknown);
});
