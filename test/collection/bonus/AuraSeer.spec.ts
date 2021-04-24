import {
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';

import app from '../../../src';

const self = agent(app);

const roles: Role[] = [
	1001,
	1002,
	1003,
	Role.Troublemaker,
	Role.AuraSeer,
	Role.Seer,
	Role.Insomniac,
	Role.Villager,
	Role.Witch,
];

const room = {
	id: 0,
	ownerKey: '',
};

const playerNum = roles.length - 3;
const troublemaker = 1;
const auraseer = 2;
const seer = 3;
const insomniac = 4;
const villager = 5;
const witch = 6;

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
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('cannot move before Seer', async () => {
	const res = await self.post(`/room/${room.id}/player/${auraseer}/skill?seatKey=1`);
	expect(res.status).toBe(425);
});

it('waits for Seer', async () => {
	const res = await self.post(`/room/${room.id}/player/${seer}/skill?seatKey=1`).send({
		cards: [1, 2],
	});
	expect(res.status).toBe(200);
});

it('waits for Witch', async () => {
	const res = await self.post(`/room/${room.id}/player/${witch}/skill?seatKey=1`);
	expect(res.status).toBe(200);
});

it('cannot move before Troublemaker', async () => {
	const res = await self.post(`/room/${room.id}/player/${auraseer}/skill?seatKey=1`);
	expect(res.status).toBe(425);
});

it('waits for Troublemaker', async () => {
	const res = await self.post(`/room/${room.id}/player/${troublemaker}/skill?seatKey=1`).send({
		players: [insomniac, seer],
	});
	expect(res.status).toBe(200);
});

it('is exchanged with Insomniac', async () => {
	const res = await self.post(`/room/${room.id}/player/${insomniac}/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	const [me] = players;
	expect(me.role).toBe(Role.Seer);
	expect(me.seat).toBe(insomniac);
});

it('wakes up Villager', async () => {
	const res = await self.post(`/room/${room.id}/player/${villager}/skill?seatKey=1`);
	expect(res.status).toBe(200);
});

it('sees Seer and Troublemaker, but not Insomniac or Witch', async () => {
	const res = await self.post(`/room/${room.id}/player/${auraseer}/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(2);
	const [s, t] = players;
	expect(s.role).toBe(Role.Unknown);
	expect(s.seat).toBe(seer);
	expect(t.role).toBe(Role.Unknown);
	expect(t.seat).toBe(troublemaker);
});
