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
	1001,
	1002,
	1003,
	Role.Werewolf,
	Role.DreamWolf,
	Role.Minion,
	Role.Robber,
];

const playerNum = roles.length - 3;
const minion = 3;
const robber = 4;

const room = {
	id: 0,
	ownerKey: '',
};
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
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('can act after Robber does', async () => {
	const res = await self.post(`/room/${room.id}/player/${robber}/skill?seatKey=1`)
		.send({ players: [2] });
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players[0].role).toBe(Role.DreamWolf);
});

it('sees all werewolves', async () => {
	const res = await self.post(`/room/${room.id}/player/${minion}/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { cards, players } = res.body as Vision;

	expect(cards).toBeUndefined();

	expect(players[0].role).toBe(Role.Werewolf);
	expect(players[0].seat).toBe(1);
	expect(players[1].role).toBe(Role.Werewolf);
	expect(players[1].seat).toBe(2);
});
