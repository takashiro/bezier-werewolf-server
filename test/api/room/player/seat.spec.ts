import {
	afterAll,
	beforeAll,
	expect,
	it,
	jest,
} from '@jest/globals';
import { agent } from 'supertest';
import {
	Player,
	Role,
} from '@bezier/werewolf-core';

import Driver from '../../../../src/base/Driver';
import { lobby } from '../../../../src/base/Lobby';
import app from '../../../../src';

const self = agent(app);

const roles: Role[] = [1, 1, 2, 2, 1, 2, 2, 2];

const room = {
	id: 0,
	salt: '',
	ownerKey: '',
	cardNum: 3,
	roles: [],
};

beforeAll(async () => {
	const res = await self.post('/room').send({ roles });
	Object.assign(room, res.body);
});

afterAll(async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200);
});

it('rejects invalid room id', async () => {
	await self.get('/room/abc/player/1/seat?seatKey=1')
		.expect(400, 'Invalid room id');
});

it('rejects invalid seat number', async () => {
	await self.get(`/room/${room.id}/player/abc/seat?seatKey=1`)
		.expect(400, 'Invalid seat number');
});

it('rejects empty seat key', async () => {
	await self.get(`/room/${room.id}/player/1/seat`)
		.expect(401, 'Seat key cannot be empty');
});

it('handles incorrect game driver', async () => {
	const r = lobby.get(room.id);
	const getDriver = jest.spyOn(r, 'getDriver');

	getDriver.mockReturnValue(undefined);
	await self.get(`/room/${room.id}/player/1/seat?seatKey=1`)
		.expect(500, 'Game driver is not loaded');

	getDriver.mockReturnValue({} as unknown as Driver);
	await self.get(`/room/${room.id}/player/1/seat?seatKey=1`)
		.expect(500, 'Game driver is not loaded');

	getDriver.mockRestore();
});

const players: Player[] = [];
it('fetches all roles', async () => {
	const playerNum = roles.length - 3;
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=${seat}`);
		expect(res.status).toBe(200);

		const player: Player = res.body;
		expect(player.seat).toBe(seat);
		expect(player.role).toBeGreaterThan(0);
		expect(roles).toContain(player.role);
		players.push(player);
	}
});

it('rejects taken seat', async () => {
	await self.get(`/room/${room.id}/player/1/seat?seatKey=2`)
		.expect(409, 'The seat has been taken');
});

it('accepts duplicate seat request', async () => {
	for (let seat = 1; seat <= players.length; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=${seat}`);
		expect(res.status).toBe(200);

		const player: Player = res.body;
		const baseline = players[seat - 1];
		expect(player).toStrictEqual(baseline);
	}
});

it('rejects invalid seat numbers', async () => {
	for (let i = 1; i <= 3; i++) {
		const seat = players.length + i;
		await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=${seat}`)
			.expect(404, 'The seat does not exist');
	}
});
