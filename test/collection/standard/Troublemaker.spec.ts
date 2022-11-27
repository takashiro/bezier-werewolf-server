import {
	afterAll,
	beforeAll,
	describe,
	expect,
	it,
} from '@jest/globals';
import { agent } from 'supertest';

import {
	Role,
	Vision,
} from '@bezier/werewolf-core';

import app from '../../../src';

const self = agent(app);

const roles: Role[] = [
	1001,
	1002,
	1003,
	Role.Troublemaker,
	Role.Troublemaker,
	2003,
	2004,
	2005,
	2006,
	2007,
];

describe('exchange actions in order', () => {
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

	it('fetches all roles', async () => {
		const playerNum = roles.length - 3;
		for (let seat = 1; seat <= playerNum; seat++) {
			const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('rejects the same player', async () => {
		await self.post(`/room/${room.id}/player/1/skill?seatKey=1`).send({ players: [3, 3] })
			.expect(400, 'Invalid skill targets');
	});

	it('rejects self', async () => {
		await self.post(`/room/${room.id}/player/1/skill?seatKey=1`).send({ players: [3, 3] })
			.expect(400, 'Invalid skill targets');
	});

	it('exchanges 2 players (Player 1)', async () => {
		const res = await self.post(`/room/${room.id}/player/1/skill?seatKey=1`)
			.send({ players: [3, 4] });
		expect(res.status).toBe(200);
	});

	it('exchanges 2 players (Player 2)', async () => {
		const res = await self.post(`/room/${room.id}/player/2/skill?seatKey=1`)
			.send({ players: [4, 5] });
		expect(res.status).toBe(200);
	});

	it('gets ready', async () => {
		for (let seat = 3; seat <= 7; seat++) {
			await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
		}
	});

	it('votes', async () => {
		for (let seat = 1; seat <= 7; seat++) {
			await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
				.send({ target: 1 });
		}
	});

	it('checkes roles', async () => {
		const res = await self.get(`/room/${room.id}/player/1/lynch?seatKey=1`);
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		const playerRoles = players.map((player) => player.role);
		expect(playerRoles).toStrictEqual([
			Role.Troublemaker,
			Role.Troublemaker,
			2004,
			2005,
			2003,
			2006,
			2007,
		]);
	});
});

describe('exchange actions in reverse order', () => {
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

	it('fetches all roles', async () => {
		const playerNum = roles.length - 3;
		for (let seat = 1; seat <= playerNum; seat++) {
			const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('exchanges 2 players (Player 2)', async () => {
		const res = await self.post(`/room/${room.id}/player/2/skill?seatKey=1`)
			.send({ players: [4, 5] });
		expect(res.status).toBe(200);
	});

	it('exchanges 2 players (Player 1)', async () => {
		const res = await self.post(`/room/${room.id}/player/1/skill?seatKey=1`)
			.send({ players: [3, 4] });
		expect(res.status).toBe(200);
	});

	it('gets ready', async () => {
		for (let seat = 3; seat <= 7; seat++) {
			await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
		}
	});

	it('votes', async () => {
		for (let seat = 1; seat <= 7; seat++) {
			await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
				.send({ target: 1 });
		}
	});

	it('checkes roles', async () => {
		const res = await self.get(`/room/${room.id}/player/1/lynch?seatKey=1`);
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		const playerRoles = players.map((player) => player.role);
		expect(playerRoles).toStrictEqual([
			Role.Troublemaker,
			Role.Troublemaker,
			2004,
			2005,
			2003,
			2006,
			2007,
		]);
	});
});
