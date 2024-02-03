import {
	afterAll,
	beforeAll,
	describe,
	expect,
	it,
} from '@jest/globals';
import { agent } from 'supertest';

import {
	Player,
	Role,
	Vision,
} from '@bezier/werewolf-core';

import app from '../../../src/index.js';

const self = agent(app);

// Configure roles
const roles = [
	1001,
	1002,
	1003,
	Role.ParanormalInvestigator,
	Role.ParanormalInvestigator,
	Role.ParanormalInvestigator,
	Role.ParanormalInvestigator,
	Role.ParanormalInvestigator,
	Role.Tanner,
	Role.Villager,
	Role.DreamWolf,
	Role.Villager,
	Role.Werewolf,
] as Role[];

const investigators = [1, 2, 3, 4, 5];
const tanners = [6];
const villagers = [7, 9];
const werewolves = [8, 10];

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

it('takes all seats', async () => {
	for (let seat = 1; seat <= roles.length - 3; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('tests invalid skill targets', async () => {
	const [me] = investigators;
	const skillApi = `/room/${room.id}/player/${me}/skill?seatKey=1`;
	await self.post(skillApi)
		.expect(400, 'Invalid skill targets');
	await self.post(skillApi).send({ players: [me] })
		.expect(400, 'Invalid skill targets');
	await self.post(skillApi).send({ players: [me, me + 1] })
		.expect(400, 'Invalid skill targets');
});

describe('sees 2 villagers', () => {
	const me: Player = {
		seat: investigators[0],
		role: Role.ParanormalInvestigator,
	};
	const targets: Player[] = [
		{
			role: Role.Villager,
			seat: villagers[0],
		},
		{
			role: Role.Villager,
			seat: villagers[1],
		},
	];

	it('sees 1 villager', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [villagers[0]] });

		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0]).toStrictEqual(targets[0]);
	});

	it('sees the same villager again', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [villagers[0]] });

		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0]).toStrictEqual(targets[0]);
	});

	it('sees another villager', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [villagers[1]] });
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(2);
		expect(players[0]).toStrictEqual(targets[0]);
		expect(players[1]).toStrictEqual(targets[1]);
	});
});

describe('sees 1 villager and 1 werewolf', () => {
	const me: Player = {
		seat: investigators[1],
		role: Role.Werewolf,
	};
	const targets: Player[] = [
		{
			role: Role.Villager,
			seat: villagers[0],
		},
		{
			role: Role.DreamWolf,
			seat: werewolves[0],
		},
	];

	it('sees 1 villager', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [villagers[0]] });
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0]).toStrictEqual(targets[0]);
	});

	it('sees 1 werewolf', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [werewolves[0]] });
		const { players } = res.body as Vision;
		expect(players).toHaveLength(3);
		expect(players[0]).toStrictEqual(targets[0]);
		expect(players[1]).toStrictEqual(targets[1]);
		expect(players[2]).toStrictEqual(me);
	});
});

describe('sees 1 villager and 1 tanner', () => {
	const me: Player = {
		seat: investigators[2],
		role: Role.Tanner,
	};
	const targets: Player[] = [
		{
			role: Role.Villager,
			seat: villagers[0],
		},
		{
			role: Role.Tanner,
			seat: tanners[0],
		},
	];

	it('sees 1 villager', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [villagers[0]] });
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0]).toStrictEqual(targets[0]);
	});

	it('sees 1 tanner', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: tanners });
		const { players } = res.body as Vision;
		expect(players).toHaveLength(3);
		expect(players[0]).toStrictEqual(targets[0]);
		expect(players[1]).toStrictEqual(targets[1]);
		expect(players[2]).toStrictEqual(me);
	});
});

describe('sees 1 werewolf and stop', () => {
	const me: Player = {
		seat: investigators[3],
		role: Role.Werewolf,
	};
	const targets: Player[] = [
		{
			role: Role.DreamWolf,
			seat: werewolves[0],
		},
	];

	it('sees 1 werewolf', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [werewolves[0]] });
		const { players } = res.body as Vision;
		expect(players).toHaveLength(2);
		expect(players[0]).toStrictEqual(targets[0]);
		expect(players[1]).toStrictEqual(me);
	});

	it('must stop', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [villagers[0]] });
		expect(res.status).toBe(400);
	});
});

describe('sees 1 tanner and stop', () => {
	const me: Player = {
		seat: investigators[4],
		role: Role.Tanner,
	};
	const targets: Player[] = [
		{
			role: Role.Tanner,
			seat: tanners[0],
		},
	];

	it('sees 1 werewolf', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [tanners[0]] });
		const { players } = res.body as Vision;
		expect(players).toHaveLength(2);
		expect(players[0]).toStrictEqual(targets[0]);
		expect(players[1]).toStrictEqual(me);
	});

	it('must stop', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [villagers[0]] });
		expect(res.status).toBe(400);
	});
});

describe('validates transformation', () => {
	it('gets ready', async () => {
		for (let seat = 6; seat <= 10; seat++) {
			const res = await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('votes', async () => {
		for (let seat = 1; seat <= 10; seat++) {
			await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
				.send({ target: 1 });
		}
	});

	it('validates that investigators are transformed', async () => {
		const res = await self.get(`/room/${room.id}/player/1/board?seatKey=1`);
		expect(res.status).toBe(200);

		const { players } = res.body as Vision;
		expect(players).toHaveLength(10);

		expect(players[0].role).toBe(Role.ParanormalInvestigator);
		expect(players[1].role).toBe(Role.Werewolf);
		expect(players[2].role).toBe(Role.Tanner);
		expect(players[3].role).toBe(Role.Werewolf);
		expect(players[4].role).toBe(Role.Tanner);
		expect(players[5].role).toBe(Role.Tanner);
		expect(players[6].role).toBe(Role.Villager);
		expect(players[7].role).toBe(Role.DreamWolf);
		expect(players[8].role).toBe(Role.Villager);
		expect(players[9].role).toBe(Role.Werewolf);
	});
});
