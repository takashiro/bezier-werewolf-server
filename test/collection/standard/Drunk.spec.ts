import {
	Player,
	Role,
	Vision,
} from '@bezier/werewolf-core';
import { agent } from 'supertest';

import app from '../../../src';
import { lobby } from '../../../src/base/Lobby';

const self = agent(app);

const roles: Role[] = [];
const room = {
	id: 0,
	ownerKey: '',
};
const players: Player[] = [];
let drunk: Player;
let skillApi: string;
let card: number;
let vision: Vision;

beforeAll(async () => {
	// Configure roles
	for (let i = 0; i < 4; i++) {
		roles.push(Role.Drunk);
		roles.push(Role.Seer);
	}
	for (let i = 1000; i <= 1020; i++) {
		roles.push(i);
	}

	// Create a room
	const res = await self.post('/room').send({ roles })
		.expect(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`)
		.expect(200);
});

it('fetches roles', async () => {
	const playerNum = roles.length - 3;
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		players.push(res.body);
	}
	drunk = players.find((player) => player.role === Role.Drunk);
	skillApi = `/room/${room.id}/player/${drunk.seat}/skill?seatKey=1`;
});

it('validate user input', async () => {
	await self.post(skillApi)
		.expect(400, 'Invalid skill targets');
});

it('filters non-existing targets', async () => {
	await self.post(skillApi).send({ cards: [3] })
		.expect(400, 'Invalid skill targets');
	await self.post(skillApi).send({ cards: [-1] })
		.expect(400, 'Invalid skill targets');
});

it('exchanges the card with a center card', async () => {
	card = Math.floor(Math.random() * 3);
	await self.post(skillApi).send({ cards: [card] })
		.expect(200);
});

it('checkes center cards', async () => {
	const seer = players.find((player) => player.role === Role.Seer);
	const res = await self.post(`/room/${room.id}/player/${seer.seat}/skill?seatKey=1`)
		.send({ cards: [card, (card + 1) % 3] })
		.expect(200);
	vision = res.body;
});

it('reveals all roles', async () => {
	const driver = lobby.get(room.id).getDriver();
	driver.exec();

	for (const player of players) {
		const res = await self.post(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`)
			.send({ target: 1 });
		expect(res.status).toBe(200);
	}

	for (const player of players) {
		const res = await self.get(`/room/${room.id}/player/${player.seat}/lynch?seatKey=1`);
		const board: Vision = res.body;
		expect(board.cards[card].role).toBe(Role.Drunk);
		expect(board.players[drunk.seat - 1].role).toBe(vision.cards[0].role);
	}
});
