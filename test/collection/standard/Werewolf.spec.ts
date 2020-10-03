import {
	Player,
	Role,
	Team,
	Teamship,
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

beforeAll(async () => {
	for (let i = 0; i < 5; i++) {
		roles.push(Role.Werewolf);
	}
	for (let i = 0; i < 10; i++) {
		roles.push(Role.Villager);
	}

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
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=${seat}`);
		expect(res.status).toBe(200);
		const player: Player = res.body;
		players.push(player);
	}
});

it('check werewolves', async () => {
	const wolves = players.filter((player) => Teamship.get(player.role) === Team.Werewolf);
	expect(wolves.length).toBeGreaterThanOrEqual(2);

	for (const wolf of wolves) {
		const res = await self.post(`/room/${room.id}/player/${wolf.seat}/skill?seatKey=${wolf.seat}`);
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(wolves.length - 1);

		const seats = vision.players.map((player) => player.seat);
		for (let i = 0; i < wolves.length; i++) {
			const { seat } = wolves[i];
			if (seat === wolf.seat) {
				expect(seats).not.toContain(seat);
			} else {
				expect(seats).toContain(seat);
			}
		}
	}
});
