import {
	Player,
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';
import app from '../../../src';

const self = agent(app);

// Configure roles
const roles: Role[] = new Array(20);
roles.fill(Role.Robber, 0, 4);
for (let i = 4; i < roles.length; i++) {
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
	for (let seat = 1; seat <= roles.length - 3; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
		players.push(res.body);
	}
});

it('validates user input', async () => {
	const robber = players.find((player) => player.role === Role.Robber);
	const skillApi = `/room/${room.id}/player/${robber.seat}/skill?seatKey=1`;

	// Validate user input
	await self.post(skillApi).send({})
		.expect(400, 'Invalid skill targets');

	// Non-existing target
	await self.post(skillApi).send({ players: [players.length + 1] })
		.expect(400, 'Invalid skill targets');

	// Disallow robbing oneself
	await self.post(skillApi).send({ players: [robber.seat] })
		.expect(400, 'Invalid skill targets');
});

const exchanges: [number, number][] = [];
it('rob other\'s role', async () => {
	const robbers = players.filter((player) => player.role === Role.Robber);
	for (const robber of robbers) {
		let target = 0;
		do {
			target = Math.floor(Math.random() * players.length) + 1;
		} while (target === robber.seat);

		const res = await self.post(`/room/${room.id}/player/${robber.seat}/skill?seatKey=1`).send({ players: [target] });
		expect(res.status).toBe(200);

		const vision: Vision = res.body;
		expect(vision.players[0].seat).toBe(robber.seat);
		expect(vision.players[0].role).toBe(players[target - 1].role);

		exchanges.push([target, robber.seat]);
	}
});

it('gets ready and votes', async () => {
	await Promise.all(players.map(async (player) => {
		await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
	}));

	await Promise.all(players.map(async (player) => {
		await self.post(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`)
			.send({ target: 1 });
	}));
});

it('calculates the expected result', () => {
	expect(exchanges.length).toBeGreaterThan(0);
	for (const exchange of exchanges) {
		const from = players[exchange[0] - 1];
		const to = players[exchange[1] - 1];
		const fromRole = from.role;
		const toRole = to.role;
		from.role = toRole;
		to.role = fromRole;
	}
});

it('checkes roles', async () => {
	await Promise.all(players.map(async (player) => {
		const res = await self.get(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`);
		expect(res.status).toBe(200);
		const board: Vision = res.body;

		expect(board.players).toBeTruthy();
		for (const p of board.players) {
			const baseline = players[p.seat - 1];
			expect(baseline.role).toBe(p.role);
		}
	}));
});
