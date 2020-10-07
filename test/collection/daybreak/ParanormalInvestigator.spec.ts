import {
	Player,
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';
import app from '../../../src';

const self = agent(app);

// Configure roles
const roles: Role[] = new Array(30);
roles.fill(Role.ParanormalInvestigator, 0, 8);
roles.fill(Role.Tanner, 8, 12);
roles.fill(Role.Villager, 12, 16);
roles.fill(Role.Werewolf, 16, 20);
for (let i = 20; i < roles.length; i++) {
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

const investigators: Player[] = [];
it('finds investigators', () => {
	investigators.push(...players.filter((player) => player.role === Role.ParanormalInvestigator));
	expect(investigators.length).toBeGreaterThanOrEqual(5);
});

it('tests invalid skill targets', async () => {
	const [me] = investigators;
	const skillApi = `/room/${room.id}/player/${me.seat}/skill?seatKey=1`;
	await self.post(skillApi)
		.expect(400, 'Invalid skill targets');
	await self.post(skillApi).send({ players: [me.seat] })
		.expect(400, 'Invalid skill targets');
	await self.post(skillApi).send({ players: [me.seat, me.seat + 1] })
		.expect(400, 'Invalid skill targets');
});

describe('sees 2 villagers', () => {
	let targets: Player[];
	let me: Player;
	const otherRoles: Role[] = [
		Role.Werewolf,
		Role.Tanner,
		Role.ParanormalInvestigator,
	];

	beforeAll(() => {
		targets = players.filter((p) => !otherRoles.includes(p.role)).slice(0, 2);
		[me] = investigators;
	});

	it('sees 1 villager', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [targets[0].seat] });

		expect(res.status).toBe(200);
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(1);
		expect(vision.players[0]).toStrictEqual(targets[0]);
	});

	it('sees the same villager again', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [targets[0].seat] });

		expect(res.status).toBe(200);
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(1);
		expect(vision.players[0]).toStrictEqual(targets[0]);
	});

	it('sees another villager', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [targets[1].seat] });
		expect(res.status).toBe(200);
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(2);
		expect(vision.players).toStrictEqual(targets);
	});
});

describe('sees 1 villager and 1 werewolf', () => {
	let targets: Player[];
	let me: Player;

	beforeAll(() => {
		targets = [
			players.find((p) => p.role === Role.Villager),
			players.find((p) => p.role === Role.Werewolf),
		];
		[, me] = investigators;
	});

	it('sees 1 villager', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [targets[0].seat] });
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(1);
		expect(vision.players[0]).toStrictEqual(targets[0]);
	});

	it('sees 1 werewolf', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [targets[1].seat] });
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(3);
		expect(vision.players[0]).toStrictEqual(targets[0]);
		expect(vision.players[1]).toStrictEqual(targets[1]);
		expect(vision.players[2]).toStrictEqual({
			seat: me.seat,
			role: Role.Werewolf,
		});
	});
});

describe('sees 1 villager and 1 tanner', () => {
	let targets: Player[];
	let me: Player;

	beforeAll(() => {
		targets = [
			players.find((p) => p.role === Role.Villager),
			players.find((p) => p.role === Role.Tanner),
		];
		[,, me] = investigators;
	});

	it('sees 1 villager', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [targets[0].seat] });
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(1);
		expect(vision.players[0]).toStrictEqual(targets[0]);
	});

	it('sees 1 tanner', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [targets[1].seat] });
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(3);
		expect(vision.players[0]).toStrictEqual(targets[0]);
		expect(vision.players[1]).toStrictEqual(targets[1]);
		expect(vision.players[2]).toStrictEqual({
			seat: me.seat,
			role: Role.Tanner,
		});
	});
});

describe('sees 1 werewolf and stop', () => {
	let target: Player;
	let me: Player;

	beforeAll(() => {
		target = players.find((p) => p.role === Role.Werewolf);
		[,,, me] = investigators;
	});

	it('sees 1 werewolf', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [target.seat] });
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(2);
		expect(vision.players[0].role).toBe(Role.Werewolf);
		expect(vision.players[0].seat).toBe(target.seat);
		expect(vision.players[1].role).toBe(Role.Werewolf);
		expect(vision.players[1].seat).toBe(me.seat);
	});

	it('must stop', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [target.seat] });
		expect(res.status).toBe(400);
	});
});

describe('sees 1 tanner and stop', () => {
	let target: Player;
	let me: Player;

	beforeAll(() => {
		target = players.find((p) => p.role === Role.Tanner);
		[,,,, me] = investigators;
	});

	it('sees 1 werewolf', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [target.seat] });
		const vision: Vision = res.body;
		expect(vision.players).toHaveLength(2);
		expect(vision.players[0].role).toBe(Role.Tanner);
		expect(vision.players[0].seat).toBe(target.seat);
		expect(vision.players[1].role).toBe(Role.Tanner);
		expect(vision.players[1].seat).toBe(me.seat);
	});

	it('must stop', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [target.seat] });
		expect(res.status).toBe(400);
	});
});

describe('validates transformation', () => {
	it('gets ready', async () => {
		for (const player of players) {
			if (player.role === Role.ParanormalInvestigator) {
				continue;
			}
			const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
			expect(res.status).toBe(200);
		}

		const wolf = players.find((p) => p.role === Role.Werewolf);
		for (let i = 5; i < investigators.length; i++) {
			const me = investigators[i];
			const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
				.send({ players: [wolf.seat] });
			expect(res.status).toBe(200);
		}
	});

	it('validates that investigators are transformed', async () => {
		await Promise.all(players.map(async (player) => {
			await self.post(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`)
				.send({ target: 1 });
		}));

		const [me] = players;
		const res = await self.get(`/room/${room.id}/player/${me.seat}/lynch?seatKey=1`);
		expect(res.status).toBe(200);
		const board: Vision = res.body;
		expect(board.players).toBeTruthy();

		const transformed = investigators.map((i) => board.players[i.seat - 1]);
		expect(transformed[0].role).toBe(Role.ParanormalInvestigator);
		expect(transformed[1].role).toBe(Role.Werewolf);
		expect(transformed[2].role).toBe(Role.Tanner);
		expect(transformed[3].role).toBe(Role.Werewolf);
		expect(transformed[4].role).toBe(Role.Tanner);

		for (const player of players) {
			if (player.role === Role.ParanormalInvestigator) {
				continue;
			}
			const out = board.players[player.seat - 1];
			expect(player.role).toBe(out.role);
		}
	});
});
