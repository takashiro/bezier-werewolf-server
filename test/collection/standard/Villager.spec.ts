import {
	afterAll,
	beforeAll,
	expect,
	it,
} from '@jest/globals';
import { agent } from 'supertest';

import { Player, Role } from '@bezier/werewolf-core';

import app from '../../../src/index.js';

const self = agent(app);

const roles: Role[] = new Array(5);
roles[0] = Role.Werewolf;
roles.fill(Role.Villager, 1);

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
	for (let seat = 1; seat <= roles.length - 3; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=${seat}`);
		expect(res.status).toBe(200);
		players.push(res.body);
	}
});

it('gets ready', async () => {
	for (const player of players) {
		const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=${player.seat}`);
		expect(res.status).toBe(200);
	}
});
