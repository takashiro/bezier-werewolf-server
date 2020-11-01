import {
	Card,
	Player,
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';
import app from '../../../src';

const self = agent(app);

// Configure roles
const roles: Role[] = new Array(20);
roles.fill(Role.Witch, 0, 6);
for (let i = 6; i < roles.length; i++) {
	roles[i] = 1000 + i;
}

const room = {
	id: 0,
	ownerKey: '',
};
const exchanged: [number, number][] = [];

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

const cards: Card[] = [
	{ pos: 0, role: Role.Unknown },
	{ pos: 1, role: Role.Unknown },
	{ pos: 2, role: Role.Unknown },
];
describe('Witch', () => {
	const witches: Player[] = [];

	it('finds witch', () => {
		witches.push(...players.filter((player) => player.role === Role.Witch));
		expect(witches.length).toBeGreaterThan(0);
	});

	it('validates invalid targets', async () => {
		await self.post(`/room/${room.id}/player/${witches[0].seat}/skill?seatKey=1`)
			.send({ cards: [3] })
			.expect(400, 'Invalid skill targets');
		await self.post(`/room/${room.id}/player/${witches[0].seat}/skill?seatKey=1`)
			.send({ players: [1] })
			.expect(400, 'Invalid skill targets');
	});

	it('views a center card and exchange it with a player', async () => {
		let i = 0;
		for (const witch of witches) {
			if (i < 3) {
				const res1 = await self.post(`/room/${room.id}/player/${witch.seat}/skill?seatKey=1`).send({ cards: [i] });
				expect(res1.status).toBe(200);
				const vision1: Vision = res1.body;
				const [card] = vision1.cards;
				cards[i].role = card.role;
				i++;

				const target = Math.floor(Math.random() * players.length) + 1;
				const res2 = await self.post(`/room/${room.id}/player/${witch.seat}/skill?seatKey=1`).send({ players: [target] });
				expect(res2.status).toBe(200);
				const vision2: Vision = res2.body;
				expect(vision2.players).toStrictEqual([{
					seat: target,
					role: card.role,
				}]);
				const player = players[target - 1];

				exchanged.push([card.pos, player.seat]);
			} else {
				// Skip the skill
				const res = await self.post(`/room/${room.id}/player/${witch.seat}/skill?seatKey=1`);
				expect(res.status).toBe(200);
			}
		}
	});
});

describe('validate exchanges', () => {
	it('gets ready', async () => {
		for (const player of players) {
			if (player.role === Role.Witch) {
				continue;
			}

			const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('votes', async () => {
		for (const player of players) {
			const res = await self.post(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`).send({ target: 1 });
			expect(res.status).toBe(200);
		}
	});

	it('calculates current roles', () => {
		for (const [c, p] of exchanged) {
			const card = cards[c];
			const player = players[p - 1];
			const { role } = card;
			card.role = player.role;
			player.role = role;
		}
	});

	it('validates lynch result', async () => {
		const allRoles: Role[] = [];
		const [me] = players;
		const res = await self.get(`/room/${room.id}/player/${me.seat}/lynch?seatKey=1`);
		expect(res.status).toBe(200);

		const board: Vision = res.body;
		expect(board.cards).toStrictEqual(cards);
		allRoles.push(...board.cards.map((card) => card.role));

		expect(board.players).toStrictEqual(players.map((player) => ({
			...player,
			target: 1,
		})));
		allRoles.push(...board.players.map((card) => card.role));

		expect(allRoles).toHaveLength(roles.length);
		allRoles.sort((a, b) => a - b);
		for (let i = 0; i < roles.length; i++) {
			expect(allRoles[i]).toBe(roles[i]);
		}
	});
});
