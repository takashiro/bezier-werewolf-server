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
	Team,
	Teamship,
	Vision,
} from '@bezier/werewolf-core';

import app from '../../../src/index.js';

const self = agent(app);

// Configure roles
const roles: Role[] = new Array(20);
roles.fill(Role.DreamWolf, 0, 4);
roles.fill(Role.Werewolf, 4, 8);
for (let i = 8; i < roles.length; i++) {
	roles[i] = 1000 + i;
}

// Create a room
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

it('can be seen by other werewolves', async () => {
	const werewolves = players
		.filter((player) => Teamship.get(player.role) === Team.Werewolf)
		.map((player) => player.seat);

	for (const player of players) {
		const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
		if (player.role === Role.Werewolf) {
			const vision: Vision = res.body;
			const seen = vision.players.map((p) => p.seat);
			expect(seen).toHaveLength(werewolves.length - 1);
			for (const wolf of werewolves) {
				if (wolf === player.seat) {
					expect(seen).not.toContain(wolf);
				} else {
					expect(seen).toContain(wolf);
				}
			}
		}
	}
});

it('sees nothing', async () => {
	for (const player of players) {
		const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
		if (player.role === Role.DreamWolf) {
			expect(res.body).toStrictEqual({});
		}
	}
});
