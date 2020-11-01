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

// Configure roles
const roles: Role[] = new Array(20);
roles.fill(Role.MysticWolf, 0, 4);
roles.fill(Role.Werewolf, 4, 8);
for (let i = 8; i < roles.length; i++) {
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

it('sees other werewolves', async () => {
	for (const player of players) {
		if (player.role !== Role.MysticWolf) {
			continue;
		}

		const res = await self.post(`/room/${room.id}/player/${player.seat}/skill/0?seatKey=1`);
		expect(res.status).toBe(200);
		const vision: Vision = res.body;
		const werewolves = vision.players;
		expect(werewolves.length).toBeGreaterThan(0);
		for (const werewolf of werewolves) {
			const baseline = players[werewolf.seat - 1];
			expect(werewolf.role).toBe(baseline.role);
			expect(Teamship.get(werewolf.role)).toBe(Team.Werewolf);
		}

		const baselines = werewolves.map((wolf) => wolf.seat)
			.map((seat) => players[seat - 1])
			.map((p) => p.role);
		expect(baselines).toContain(Role.Werewolf);
	}
});

it('forsees an invalid player target: self', async () => {
	const wolf = players.find((p) => p.role === Role.MysticWolf);
	const res = await self.post(`/room/${room.id}/player/${wolf.seat}/skill/1?seatKey=1`);
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('sees a player', async () => {
	const wolf = players.find((p) => p.role === Role.MysticWolf);
	let target = 0;
	do {
		target = Math.floor(Math.random() * players.length) + 1;
	} while (target === wolf.seat || Teamship.get(players[target - 1].role) === Team.Werewolf);

	const res = await self.post(`/room/${room.id}/player/${wolf.seat}/skill/1?seatKey=1`)
		.send({ players: [target] });
	expect(res.status).toBe(200);
	const vision: Vision = res.body;
	const [player] = vision.players;
	const baseline = players[target - 1];
	expect(player.role).toBe(baseline.role);
	expect(player.seat).toBe(baseline.seat);
});
