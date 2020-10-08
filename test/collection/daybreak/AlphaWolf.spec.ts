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
const roles: Role[] = new Array(30);
roles.fill(Role.AlphaWolf, 0, 4);
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
const werewolves: Player[] = [];
const alphawolves: Player[] = [];
it('fetches all roles', async () => {
	const playerNum = roles.length - 3;
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
		players.push(res.body);
	}
	werewolves.push(...players.filter((player) => Teamship.get(player.role) === Team.Werewolf));
	alphawolves.push(...werewolves.filter((player) => player.role === Role.AlphaWolf));
});

it('sees other werewolves', async () => {
	for (const player of players) {
		const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
		const vision: Vision = res.body;
		if (Teamship.get(player.role) === Team.Werewolf) {
			const seen = vision.players;
			expect(seen.length).toBe(werewolves.length - 1);
			for (const wolf of seen) {
				const baseline = players[wolf.seat - 1];
				expect(Teamship.get(baseline.role)).toBe(Team.Werewolf);
				expect(Teamship.get(wolf.role)).toBe(Team.Werewolf);
			}
		} else {
			expect(vision.cards).toBeUndefined();
			expect(vision.players).toBeUndefined();
		}
	}
});

it('rejects empty targets', async () => {
	for (const wolf of werewolves) {
		const res = await self.post(`/room/${room.id}/player/${wolf.seat}/skill/1?seatKey=1`);
		if (wolf.role === Role.Werewolf) {
			expect(res.status).toBe(404);
			expect(res.text).toBe('Skill not found');
		} else {
			expect(res.status).toBe(400);
			expect(res.text).toBe('Invalid skill targets');
		}
	}
});

it('rejects invalid target: self', async () => {
	for (const wolf of alphawolves) {
		const res = await self.post(`/room/${room.id}/player/${wolf.seat}/skill/1?seatKey=1`).send({ players: [wolf.seat] });
		expect(res.status).toBe(400);
		expect(res.text).toBe('Invalid skill targets');
	}
});

const infected: number[] = [];
it('exchanges the center werewolf card with any other player', async () => {
	for (const wolf of alphawolves) {
		let target = 0;
		do {
			target = Math.floor(Math.random() * players.length) + 1;
		} while (Teamship.get(players[target - 1].role) === Team.Werewolf);
		const res = await self.post(`/room/${room.id}/player/${wolf.seat}/skill/1?seatKey=1`).send({ players: [target] });
		expect(res.status).toBe(200);

		infected.push(target);
	}
});

it('votes', async () => {
	await Promise.all(players.map(async (player) => {
		await self.post(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`)
			.send({ target: 1 });
	}));
});

it('predicts player roles', () => {
	const cards: Role[] = new Array(3 + alphawolves.length);
	cards.fill(Role.Unknown, 0, 3);
	cards.fill(Role.Werewolf, 3);

	let i = 3;
	for (const target of infected) {
		const player = players[target - 1];
		const { role } = player;
		player.role = cards[i];
		cards[i] = role;
		i++;
	}
});

it('validates exchange result', async () => {
	const [me] = players;

	const res = await self.get(`/room/${room.id}/player/${me.seat}/lynch?seatKey=1`);
	expect(res.status).toBe(200);

	const board: Vision = res.body;
	for (const player of board.players) {
		const baseline = players[player.seat - 1];
		expect(player.role).toBe(baseline.role);
		expect(player.seat).toBe(baseline.seat);
	}

	expect(board.cards).toHaveLength(3 + alphawolves.length);

	const allRoles: Role[] = [
		...board.cards.map((card) => card.role),
		...board.players.map((player) => player.role),
	];
	allRoles.sort();
	const expectedRoles: Role[] = [...roles];
	for (let i = 0; i < alphawolves.length; i++) {
		expectedRoles.push(Role.Werewolf);
	}
	expectedRoles.sort();
	expect(allRoles).toStrictEqual(expectedRoles);
});
