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
	2001,
	2002,
	2003,
	Role.VillageIdiot,
	2005,
	2006,
];

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const me: Player = {
	seat: 4,
	role: Role.AlphaWolf,
};

describe('rotate left', () => {
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
		const players: Player[] = [];
		const playerNum = roles.length - 3;
		for (let seat = 1; seat <= playerNum; seat++) {
			const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
			expect(res.status).toBe(200);
			players.push(res.body);
		}
		expect(players[3].role).toBe(Role.VillageIdiot);
	});

	it('rejects invalid target', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [me.seat - 2] });
		expect(res.status).toBe(400);
		expect(res.text).toBe('Invalid skill targets');
	});

	it('rotates all roles to left', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [me.seat - 1] });
		expect(res.status).toBe(200);
		const vision = res.body;
		expect(vision?.cards).toBeUndefined();
		expect(vision?.players).toBeUndefined();
	});

	it('gets ready', async () => {
		for (let seat = 1; seat <= 6; seat++) {
			if (seat === me.seat) {
				continue;
			}
			const res = await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('votes', async () => {
		for (let seat = 1; seat <= 6; seat++) {
			const res = await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
				.send({ target: 1 });
			expect(res.status).toBe(200);
		}
	});

	it('validates rotation result', async () => {
		const res = await self.get(`/room/${room.id}/player/${me.seat}/lynch?seatKey=1`);
		expect(res.status).toBe(200);

		const { players } = res.body as Vision;
		expect(players[0].role).toBe(2002);
		expect(players[1].role).toBe(2003);
		expect(players[2].role).toBe(2005);
		expect(players[3].role).toBe(Role.VillageIdiot);
		expect(players[4].role).toBe(2006);
		expect(players[5].role).toBe(2001);
	});
});

describe('rotate right', () => {
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
		const players: Player[] = [];
		const playerNum = roles.length - 3;
		for (let seat = 1; seat <= playerNum; seat++) {
			const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
			expect(res.status).toBe(200);
			players.push(res.body);
		}
		expect(players[3].role).toBe(Role.VillageIdiot);
	});

	it('rejects invalid target', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [me.seat + 2] });
		expect(res.status).toBe(400);
		expect(res.text).toBe('Invalid skill targets');
	});

	it('rotates all roles to right', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [me.seat + 1] });
		expect(res.status).toBe(200);
		const vision = res.body;
		expect(vision?.cards).toBeUndefined();
		expect(vision?.players).toBeUndefined();
	});

	it('gets ready', async () => {
		for (let seat = 1; seat <= 6; seat++) {
			if (seat === me.seat) {
				continue;
			}
			const res = await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('votes', async () => {
		for (let seat = 1; seat <= 6; seat++) {
			const res = await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
				.send({ target: 1 });
			expect(res.status).toBe(200);
		}
	});

	it('validates rotation result', async () => {
		const res = await self.get(`/room/${room.id}/player/${me.seat}/lynch?seatKey=1`);
		expect(res.status).toBe(200);

		const { players } = res.body as Vision;
		expect(players[0].role).toBe(2006);
		expect(players[1].role).toBe(2001);
		expect(players[2].role).toBe(2002);
		expect(players[3].role).toBe(Role.VillageIdiot);
		expect(players[4].role).toBe(2003);
		expect(players[5].role).toBe(2005);
	});
});

describe('do nothing', () => {
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
		const players: Player[] = [];
		const playerNum = roles.length - 3;
		for (let seat = 1; seat <= playerNum; seat++) {
			const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
			expect(res.status).toBe(200);
			players.push(res.body);
		}
		expect(players[3].role).toBe(Role.VillageIdiot);
	});

	it('do nothing', async () => {
		const res = await self.post(`/room/${room.id}/player/${me.seat}/skill?seatKey=1`)
			.send({ players: [me.seat] });
		expect(res.status).toBe(200);
		const vision = res.body;
		expect(vision?.cards).toBeUndefined();
		expect(vision?.players).toBeUndefined();
	});

	it('gets ready', async () => {
		for (let seat = 1; seat <= 6; seat++) {
			if (seat === me.seat) {
				continue;
			}
			const res = await self.post(`/room/${room.id}/player/${seat}/skill?seatKey=1`);
			expect(res.status).toBe(200);
		}
	});

	it('votes', async () => {
		for (let seat = 1; seat <= 6; seat++) {
			const res = await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
				.send({ target: 1 });
			expect(res.status).toBe(200);
		}
	});

	it('validates rotation result', async () => {
		const res = await self.get(`/room/${room.id}/player/${me.seat}/lynch?seatKey=1`);
		expect(res.status).toBe(200);

		const { players } = res.body as Vision;
		expect(players[0].role).toBe(2001);
		expect(players[1].role).toBe(2002);
		expect(players[2].role).toBe(2003);
		expect(players[3].role).toBe(Role.VillageIdiot);
		expect(players[4].role).toBe(2005);
		expect(players[5].role).toBe(2006);
	});
});
