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

const roles: Role[] = new Array(50);
roles.fill(Role.Werewolf, 0, 5);
roles.fill(Role.AlphaWolf, 5, 10);
roles.fill(Role.Minion, 10, 15);
for (let i = 15; i < 50; i++) {
	roles[i] = 1000 + i;
}

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

it('sees all werewolves', async () => {
	const werewolves = players.filter((player) => Teamship.get(player.role) === Team.Werewolf);
	const minions = players.filter((player) => player.role === Role.Minion);
	for (const minion of minions) {
		const res = await self.post(`/room/${room.id}/player/${minion.seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
		const vision: Vision = res.body;

		const seen = vision.players.map((player) => player.seat);
		expect(seen).toHaveLength(werewolves.length);
		for (const werewolf of werewolves) {
			expect(seen).toContain(werewolf.seat);
		}

		expect(werewolves.some((werewolf) => werewolf.role !== Role.Werewolf)).toBe(true);
		for (const player of vision.players) {
			expect(player.role).toBe(Role.Werewolf);
		}
	}
});
