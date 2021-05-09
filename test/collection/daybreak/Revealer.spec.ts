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
	Role.Revealer,
	Role.Robber,
	Role.Werewolf,
];

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const me: Player = {
	seat: 1,
	role: Role.Revealer,
};

describe('Reveal a Villager', () => {
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
		}
	});

	it('is not ready before Robber', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
		expect(res.status).toBe(425);
		expect(res.text).toBe('Skill not ready');
	});

	it('waits until Robber takes the role of Player No. 3', async () => {
		const res = await self.post(`/room/${room.id}/player/2/skill?seatKey=1`)
			.send({ players: [3] });
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0].role).toBe(Role.Werewolf);
	});

	it('rejects empty target', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`);
		expect(res.status).toBe(400);
		expect(res.text).toBe('Invalid skill targets');
	});

	it('reveals Player No. 3', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [3] });
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0].role).toBe(Role.Robber);
	});

	it('waits for all night actions', async () => {
		const res = await self.get(`/room/${room.id}/player/${me.seat}/board?seatKey=1`);
		expect(res.status).toBe(425);
		expect(res.text).toBe('Other players are still invoking their skills.');
	});

	it('gets ready', async () => {
		const res = await self.post(`/room/${room.id}/player/3/skill?seatKey=1`);
		expect(res.status).toBe(200);
	});

	it('makes Player No. 3 visible to all', async () => {
		const res = await self.get(`/room/${room.id}/player/${me.seat}/board?seatKey=1`);
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0].role).toBe(Role.Robber);
	});
});

describe('Reveal a Werewolf', () => {
	beforeAll(async () => {
		const res = await self.post('/room').send({ roles, random: false });
		expect(res.status).toBe(200);
		Object.assign(room, res.body);
	});

	afterAll(async () => {
		const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
		expect(res.status).toBe(200);
	});

	it('does not block Robber entering night phase', async () => {
		await self.get(`/room/${room.id}/player/2/seat?seatKey=1`)
			.expect(200);
		await self.get(`/room/${room.id}/player/2/board?seatKey=1`)
			.expect(200);
	});

	it('waits until Robber takes the role of Player No. 1', async () => {
		const res = await self.post(`/room/${room.id}/player/2/skill?seatKey=1`)
			.send({ players: [1] });
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0].role).toBe(Role.Revealer);
	});

	it('blocks Robber entering day phase', async () => {
		await self.get(`/room/${room.id}/player/2/board?seatKey=1`)
			.expect(425, 'Other players are still taking their seats.');
	});

	it('takes his seat', async () => {
		await self.get(`/room/${room.id}/player/${me.seat}/seat?seatKey=1`)
			.expect(200);
	});

	it('reveals Player No. 3', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [3] });
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(1);
		expect(players[0].role).toBe(Role.Werewolf);
	});

	it('gets ready', async () => {
		await self.get(`/room/${room.id}/player/3/seat?seatKey=1`)
			.expect(200);
		const res = await self.post(`/room/${room.id}/player/3/skill?seatKey=1`);
		expect(res.status).toBe(200);
	});

	it('cannot reveal a werewolf or a tanner', async () => {
		const res = await self.get(`/room/${room.id}/player/${me.seat}/board?seatKey=1`);
		expect(res.status).toBe(200);
		const { players } = res.body as Vision;
		expect(players).toHaveLength(0);
	});
});
