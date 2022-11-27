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
	Vision,
} from '@bezier/werewolf-core';

import app from '../../../src';

const self = agent(app);

const roles: Role[] = [];
const room = {
	id: 0,
	ownerKey: '',
};
const players: Player[] = [];

beforeAll(async () => {
	for (let i = 0; i < 5; i++) {
		roles.push(Role.Mason);
		roles.push(Role.Werewolf);
	}
	for (let i = 0; i < 20; i++) {
		roles.push(Role.Villager);
	}

	const res = await self.post('/room').send({ roles });
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
		players.push(res.body);
	}
});

it('checkes Mason companions', async () => {
	const masons = players.filter((player) => player.role === Role.Mason);
	expect(masons.length).toBeGreaterThanOrEqual(2);

	for (const mason of masons) {
		const res = await self.post(`/room/${room.id}/player/${mason.seat}/skill?seatKey=1`)
			.expect(200);
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(masons.length - 1);
		for (const player of vision.players) {
			expect(player.role).toBe(Role.Mason);
		}

		const seats = vision.players.map((player) => player.seat);
		for (let i = 0; i < masons.length; i++) {
			const { seat } = masons[i];
			if (seat === mason.seat) {
				expect(seats).not.toContain(seat);
			} else {
				expect(seats).toContain(seat);
			}
		}
	}
});
