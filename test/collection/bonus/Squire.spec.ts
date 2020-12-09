import {
	Player,
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';
import app from '../../../src';

const self = agent(app);

// Configure roles
const roles: Role[] = [
	1001,
	1002,
	1003,
	Role.Squire,
	Role.Werewolf,
	Role.Troublemaker,
	Role.Tanner,
];

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const me: Player = {
	seat: 1,
	role: Role.Squire,
};

beforeAll(async () => {
	const res = await self.post('/room').send({ roles, random: false });
	expect(res.status).toBe(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	expect(res.status).toBe(200);
});

it('fetches all roles', async () => {
	for (let seat = 1; seat <= 4; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('waits for other night actions', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
	expect(res.status).toBe(425);
});

it('waits for Troublemaker', async () => {
	const res = await self.post(`/room/${room.id}/player/3/skill?seatKey=1`)
		.send({ players: [2, 4] });
	expect(res.status).toBe(200);
});

it('sees Tanner', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	const [player] = players;
	expect(player.seat).toBe(2);
	expect(player.role).toBe(Role.Tanner);
});
