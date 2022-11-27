import {
	afterAll,
	beforeAll,
	expect,
	it,
} from '@jest/globals';
import { agent } from 'supertest';
import {
	LynchResult,
	Player,
	Role,
} from '@bezier/werewolf-core';

import app from '../../../../src';
import shuffle from '../../../../src/util/shuffle';

const self = agent(app);

const roles: Role[] = new Array(20);
for (let i = 0; i < 20; i++) {
	roles[i] = 1000 + i;
}

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
	await self.post('/room/0/player/1000/lynch')
		.expect(400, 'Invalid room id');

	await self.get('/room/0/player/1000/lynch')
		.expect(400, 'Invalid room id');
});

it('rejects invalid seat number', async () => {
	await self.post(`/room/${room.id}/player/0/lynch`)
		.expect(400, 'Invalid seat number');
});

it('rejects invalid seat key', async () => {
	await self.post(`/room/${room.id}/player/1/lynch`)
		.expect(401, 'Seat key cannot be empty');
});

it('rejects non-existing rooms', async () => {
	await self.post('/room/1000/player/1/lynch?seatKey=1').send({ target: 1 })
		.expect(404, 'The room does not exist');
});

it('rejects non-existing seat', async () => {
	await self.post(`/room/${room.id}/player/1000/lynch?seatKey=1`).send({ target: 1 })
		.expect(404, 'The seat does not exist');
});

it('rejects untaken seats', async () => {
	await self.post(`/room/${room.id}/player/1/lynch?seatKey=1`).send({ target: 1 })
		.expect(403, 'The seat has not been taken');
});

const players: Player[] = [];
it('fetches all roles', async () => {
	const playerNum = roles.length - 3;
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
		players.push(res.body);
	}
});

it('rejects invalid seat key', async () => {
	await self.post(`/room/${room.id}/player/1/lynch?seatKey=abc`).send({ target: 2 })
		.expect(403, 'Invalid seat key');
});

it('rejects invalid target seat number', async () => {
	await self.post(`/room/${room.id}/player/1/lynch?seatKey=1`).send({})
		.expect(400, 'Invalid target seat number');
});

it('rejects any vote until all players have invoked their skills or been ready', async () => {
	await self.post(`/room/${room.id}/player/1/lynch?seatKey=1`).send({ target: 1 })
		.expect(425, 'Too early to vote. Other players are still invoking their skills.');
});

it('rejects vote progress until all players have invoked their skills or been ready', async () => {
	await self.get(`/room/${room.id}/player/1/lynch?seatKey=1`)
		.expect(425, 'Other players are still invoking their skills.');
});

it('gets ready', async () => {
	for (const player of players) {
		const res = await self.post(`/room/${room.id}/player/${player.seat}/skill?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('rejects non-existing target', async () => {
	await self.post(`/room/${room.id}/player/1/lynch?seatKey=1`).send({ target: 1000 })
		.expect(400, 'The target does not exist');
});

it('shows vote progress', async () => {
	const seats = players.map((player) => player.seat);
	shuffle(seats);
	const votes = new Map<number, number>();
	for (const seat of seats) {
		const target = Math.floor(Math.random() * players.length) + 1;
		votes.set(seat, target);

		const res1 = await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`).send({ target });
		expect(res1.status).toBe(200);

		const res2 = await self.get(`/room/${room.id}/player/${seat}/lynch?seatKey=1`);
		expect(res2.status).toBe(200);

		const board: LynchResult = res2.body;
		if (votes.size < players.length) {
			expect(board.votes).toBeUndefined();
			expect(board.progress.limit).toBe(players.length);
			expect(board.progress.current).toBe(votes.size);
		} else {
			for (const vote of board.votes) {
				expect(votes.get(vote.source)).toBe(vote.target);
			}
			expect(board.votes).toHaveLength(players.length);
		}
	}
});

it('rejects duplicate votes', async () => {
	await self.post(`/room/${room.id}/player/1/lynch?seatKey=1`).send({ target: 1000 })
		.expect(409, 'You have submitted your lynch target');
});
