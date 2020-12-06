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
	Role.ApprenticeSeer,
	1004,
	1005,
];

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const me: Player = {
	seat: 1,
	role: Role.ApprenticeSeer,
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
	for (let seat = 1; seat <= 3; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
		const { role } = res.body as Player;
		expect(role).toBe(roles[2 + seat]);
	}
});

it('rejects empty targets', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('rejects player', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`).send({ players: [2] });
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('rejects invalid card', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`).send({ cards: [100] });
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('rejects more than 1 card', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`).send({ cards: [0, 1] });
	expect(res.status).toBe(400);
	expect(res.text).toBe('Invalid skill targets');
});

it('sees one of the center cards', async () => {
	const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`).send({ cards: [2] });
	expect(res.status).toBe(200);
	const { cards } = res.body as Vision;
	expect(cards).toHaveLength(1);
	expect(cards[0].pos).toBe(2);
	expect(cards[0].role).toBe(1003);
});
