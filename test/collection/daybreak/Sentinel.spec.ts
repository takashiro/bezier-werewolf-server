import {
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

	Role.Sentinel,
	Role.Sentinel,
	Role.Sentinel,
	Role.Sentinel,
	Role.Sentinel,
	Role.Sentinel,

	Role.Minion,
	Role.Tanner, // Shielded
	Role.ApprenticeTanner,
	Role.AlphaWolf,
	Role.MysticWolf,
	Role.Werewolf, // Shielded
	Role.Mason, // Shielded
	Role.Mason,
	Role.Seer, // Shielded
	Role.ParanormalInvestigator,
	Role.Robber,
	Role.Witch,
	Role.Troublemaker,
	Role.VillageIdiot,
	Role.Drunk, // Shielded
	Role.Insomniac, // Shielded
	Role.Squire,
	Role.Beholder,
	Role.Revealer,
];

// Create a room
const room = {
	id: 0,
	ownerKey: '',
};

const playerNum = roles.length - 3;
const sentinel1 = 1;
const sentinel2 = sentinel1 + 1;
const sentinel3 = sentinel2 + 1;
const sentinel4 = sentinel3 + 1;
const sentinel5 = sentinel4 + 1;
const sentinel6 = sentinel5 + 1;
const minion = sentinel6 + 1;
const tanner = minion + 1;
const apprenticeTanner = tanner + 1;
const alphaWolf = apprenticeTanner + 1;
const mysticWolf = alphaWolf + 1;
const werewolf = mysticWolf + 1;
const mason1 = werewolf + 1;
const mason2 = mason1 + 1;
const seer = mason2 + 1;
const pi = seer + 1;
const robber = pi + 1;
const witch = robber + 1;
const troublemaker = witch + 1;
const villageIdiot = troublemaker + 1;
const drunk = villageIdiot + 1;
const insomniac = drunk + 1;
const squire = insomniac + 1;
const beholder = squire + 1;
const revealer = beholder + 1;

const shielded = [tanner, werewolf, mason1, seer, drunk, insomniac];
const werewolves = [alphaWolf, mysticWolf, werewolf];

beforeAll(async () => {
	const res = await self.post('/room').send({ roles, random: false });
	expect(res.status).toBe(200);
	Object.assign(room, res.body);
});

afterAll(async () => {
	const res = await self.delete(`/room/${room.id}?ownerKey=${encodeURIComponent(room.ownerKey)}`);
	expect(res.status).toBe(200);
});

it('sees an empty board', async () => {
	await self.get(`/room/${room.id}/player/1/seat?seatKey=1`);
	await self.get(`/room/${room.id}/player/1/board?seatKey=1`)
		.expect(200, { players: [], cards: [] });
});

it('fetches all roles', async () => {
	for (let seat = 2; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/seat?seatKey=1`);
		expect(res.status).toBe(200);
	}
});

it('blocks seer from waking up', async () => {
	await self.get(`/room/${room.id}/player/${seer}/board?seatKey=1`)
		.expect(425, 'Other players are still invoking their skills.');
});

it('blocks seer skill', async () => {
	await self.post(`/room/${room.id}/player/${seer}/skill?seatKey=1`)
		.expect(425, 'Skill not ready');
});

it('blocks masons from waking up', async () => {
	await self.post(`/room/${room.id}/player/${mason1}/skill?seatKey=1`)
		.expect(425, 'Skill not ready');
});

it('does not block himself', async () => {
	const res = await self.get(`/room/${room.id}/player/${sentinel1}/board?seatKey=1`);
	const { cards, players } = res.body as Vision;
	expect(cards).toHaveLength(0);
	expect(players).toHaveLength(0);
});

it('blocks other sentinels', async () => {
	await self.get(`/room/${room.id}/player/${sentinel2}/board?seatKey=1`)
		.expect(425, 'Other players are still invoking their skills.');
});

it('cannot protect himself', async () => {
	const res = await self.post(`/room/${room.id}/player/${sentinel1}/skill?seatKey=1`)
		.send({ players: [sentinel1] });
	expect(res.status).toBe(400);
});

it('protects tanner', async () => {
	const res = await self.post(`/room/${room.id}/player/${sentinel1}/skill?seatKey=1`)
		.send({ players: [tanner] });
	expect(res.status).toBe(200);
});

it('protects werewolf', async () => {
	const res = await self.post(`/room/${room.id}/player/${sentinel2}/skill?seatKey=1`)
		.send({ players: [werewolf] });
	expect(res.status).toBe(200);
});

it('protects mason', async () => {
	const res = await self.post(`/room/${room.id}/player/${sentinel3}/skill?seatKey=1`)
		.send({ players: [mason1] });
	expect(res.status).toBe(200);
});

it('protects seer', async () => {
	const res = await self.post(`/room/${room.id}/player/${sentinel4}/skill?seatKey=1`)
		.send({ players: [seer] });
	expect(res.status).toBe(200);
});

it('protects drunk', async () => {
	const res = await self.post(`/room/${room.id}/player/${sentinel5}/skill?seatKey=1`)
		.send({ players: [drunk] });
	expect(res.status).toBe(200);
});

it('protects insomniac', async () => {
	const res = await self.post(`/room/${room.id}/player/${sentinel6}/skill?seatKey=1`)
		.send({ players: [insomniac] });
	expect(res.status).toBe(200);
});

it('places a shield token that minion can see', async () => {
	const res = await self.get(`/room/${room.id}/player/${minion}/board?seatKey=1`);
	const { cards, players } = res.body as Vision;
	expect(cards).toHaveLength(0);
	expect(players).toHaveLength(shielded.length);
	for (let i = 0; i < shielded.length; i++) {
		expect(players[i].seat).toBe(shielded[i]);
		expect(players[i].role).toBe(Role.Unknown);
		expect(players[i].shielded).toBe(true);
	}
});

it('does not prevent werewolves from putting up their thumbs', async () => {
	const res = await self.post(`/room/${room.id}/player/${minion}/skill?seatKey=1`);
	expect(res.status).toBe(200);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(werewolves.length);
	for (let i = 0; i < werewolves.length; i++) {
		expect(players[i].role).toBe(Role.Werewolf);
		expect(players[i].seat).toBe(werewolves[i]);
	}
});

it('shows nothing to tanner at night', async () => {
	const res = await self.get(`/room/${room.id}/player/${tanner}/board?seatKey=1`);
	expect(res.status).toBe(425);
	expect(res.body).toStrictEqual({});
});

it('does not affect tanner', async () => {
	await self.post(`/room/${room.id}/player/${tanner}/skill?seatKey=1`)
		.expect(200, {});
});

it('does not affect apprentice tanner', async () => {
	const res = await self.post(`/room/${room.id}/player/${apprenticeTanner}/skill?seatKey=1`);
	const { players } = res.body as Vision;
	expect(players).toHaveLength(1);
	expect(players[0].role).toBe(Role.Tanner);
	expect(players[0].seat).toBe(tanner);
});

it('does not affect werewolf', async () => {
	await self.post(`/room/${room.id}/player/${alphaWolf}/skill?seatKey=1`)
		.expect(200, {
			players: [
				{ role: Role.MysticWolf, seat: mysticWolf },
				{ role: Role.Werewolf, seat: werewolf },
			],
		});

	await self.post(`/room/${room.id}/player/${mysticWolf}/skill?seatKey=1`)
		.expect(200, {
			players: [
				{ role: Role.AlphaWolf, seat: alphaWolf },
				{ role: Role.Werewolf, seat: werewolf },
			],
		});

	await self.post(`/room/${room.id}/player/${werewolf}/skill?seatKey=1`)
		.expect(200, {
			players: [
				{ role: Role.AlphaWolf, seat: alphaWolf },
				{ role: Role.MysticWolf, seat: mysticWolf },
			],
		});
});

it('protects mason from alpha wolf', async () => {
	await self.post(`/room/${room.id}/player/${alphaWolf}/skill/1?seatKey=1`)
		.send({ players: [mason1] })
		.expect(400);
	await self.post(`/room/${room.id}/player/${alphaWolf}/skill/1?seatKey=1`)
		.send({ players: [mason2] })
		.expect(200);
});

it('protects seer from mystic wolf', async () => {
	await self.post(`/room/${room.id}/player/${mysticWolf}/skill/1?seatKey=1`)
		.send({ players: [seer] })
		.expect(400);
	await self.post(`/room/${room.id}/player/${mysticWolf}/skill/1?seatKey=1`)
		.send({ players: [revealer] })
		.expect(200, {
			players: [
				{ role: Role.Revealer, seat: revealer },
			],
		});
});

it('does not affect masons', async () => {
	await self.post(`/room/${room.id}/player/${mason1}/skill?seatKey=1`)
		.expect(200, {
			players: [
				{ role: Role.Mason, seat: mason2 },
			],
		});
	await self.post(`/room/${room.id}/player/${mason2}/skill?seatKey=1`)
		.expect(200, {
			players: [
				{ role: Role.Mason, seat: mason1 },
			],
		});
});

it('protects tanner from being seen by seer', async () => {
	await self.post(`/room/${room.id}/player/${seer}/skill?seatKey=1`)
		.send({ players: [tanner] })
		.expect(400);

	await self.post(`/room/${room.id}/player/${seer}/skill?seatKey=1`)
		.send({ cards: [1, 2] })
		.expect(200);
});

it('protects werewolf from being seen by paranormal investigator', async () => {
	await self.post(`/room/${room.id}/player/${pi}/skill?seatKey=1`)
		.send({ players: [werewolf] })
		.expect(400);

	await self.post(`/room/${room.id}/player/${pi}/skill?seatKey=1`)
		.send({ players: [mysticWolf] })
		.expect(200);
});

it('protects insomniac from robber', async () => {
	await self.post(`/room/${room.id}/player/${robber}/skill?seatKey=1`)
		.send({ players: [insomniac] })
		.expect(400);

	await self.post(`/room/${room.id}/player/${robber}/skill?seatKey=1`)
		.send({ players: [witch] })
		.expect(200, {
			players: [
				{ role: Role.Witch, seat: witch },
			],
		});
});

it('protects drunk from witch', async () => {
	await self.post(`/room/${room.id}/player/${witch}/skill?seatKey=1`)
		.send({ cards: [1] })
		.expect(200);

	await self.post(`/room/${room.id}/player/${witch}/skill?seatKey=1`)
		.send({ players: [drunk] })
		.expect(400);

	await self.post(`/room/${room.id}/player/${witch}/skill?seatKey=1`)
		.send({ players: [squire] })
		.expect(200);
});

it('protects seer from troublemaker', async () => {
	await self.post(`/room/${room.id}/player/${troublemaker}/skill?seatKey=1`)
		.send({ players: [seer, revealer] })
		.expect(400);

	await self.post(`/room/${room.id}/player/${troublemaker}/skill?seatKey=1`)
		.send({ players: [alphaWolf, revealer] })
		.expect(200);
});

it('affects village idiot', async () => {
	await self.post(`/room/${room.id}/player/${villageIdiot}/skill?seatKey=1`)
		.send({ players: [villageIdiot + 1] })
		.expect(200);
});

it('affects drunk', async () => {
	await self.post(`/room/${room.id}/player/${drunk}/skill?seatKey=1`)
		.send({ cards: [2] })
		.expect(200);
});

it('affects insomniac', async () => {
	await self.post(`/room/${room.id}/player/${insomniac}/skill?seatKey=1`)
		.expect(200, {});
});

it('protects werewolves from squire', async () => {
	await self.post(`/room/${room.id}/player/${squire}/skill?seatKey=1`)
		.expect(200, {
			players: [
				{ role: Role.ApprenticeTanner, seat: alphaWolf },
				{ role: Role.Revealer, seat: mysticWolf },
				{ role: Role.Unknown, seat: werewolf },
			],
		});
});

it('protects seers from beholder', async () => {
	await self.post(`/room/${room.id}/player/${beholder}/skill?seatKey=1`)
		.expect(200, {
			players: [
				{ role: Role.Unknown, seat: seer },
			],
		});
});

it('protects werewolf from revealer', async () => {
	await self.post(`/room/${room.id}/player/${revealer}/skill?seatKey=1`)
		.send({ players: [werewolf] })
		.expect(400);

	await self.post(`/room/${room.id}/player/${revealer}/skill?seatKey=1`)
		.send({ players: [squire] })
		.expect(200, {
			players: [
				{ role: Role.Troublemaker, seat: squire },
			],
		});
});

it('places a shield token that is visible to all at day phase', async () => {
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.get(`/room/${room.id}/player/${seat}/board?seatKey=1`);
		const { cards, players } = res.body as Vision;
		expect(cards).toHaveLength(0);
		expect(players).toHaveLength(shielded.length + 1);
		for (let i = 0; i < shielded.length; i++) {
			expect(players[i].seat).toBe(shielded[i]);
			expect(players[i].role).toBe(Role.Unknown);
			expect(players[i].shielded).toBe(true);
		}
		const revealed = players[shielded.length];
		expect(revealed.role).toBe(Role.Troublemaker);
		expect(revealed.seat).toBe(squire);
	}
});

it('votes', async () => {
	for (let seat = 1; seat <= playerNum; seat++) {
		const res = await self.post(`/room/${room.id}/player/${seat}/lynch?seatKey=1`)
			.send({ target: 1 });
		expect(res.status).toBe(200);
	}
});

it('confirms player roles', async () => {
	const res = await self.get(`/room/${room.id}/player/1/lynch?seatKey=1`);
	const { cards, players } = res.body as Vision;
	expect(cards[0]).toStrictEqual({ role: 1001, pos: 0 });
	expect(cards[1]).toStrictEqual({ role: Role.Squire, pos: 1 });
	expect(cards[2]).toStrictEqual({ role: 1003, pos: 2 });
	expect(cards[3]).toStrictEqual({ role: Role.Mason, pos: 3 });

	for (let i = 0; i < playerNum; i++) {
		expect(players[i].seat).toBe(i + 1);
	}

	const actualRoles = players.map((player) => player.role);
	expect(actualRoles).toStrictEqual([
		Role.AlphaWolf,
		Role.Sentinel,
		Role.Sentinel,
		Role.Sentinel,
		Role.Sentinel,
		Role.Sentinel,
		Role.Sentinel,

		Role.Tanner, // Shielded
		Role.Minion,
		Role.ApprenticeTanner,
		Role.Revealer,
		Role.Werewolf, // Shielded
		Role.Mason, // Shielded
		Role.MysticWolf,
		Role.Seer, // Shielded
		Role.Werewolf,
		Role.Werewolf,
		Role.Witch,
		Role.Robber,
		Role.VillageIdiot,
		Role.Drunk, // Shielded
		Role.Insomniac, // Shielded
		Role.Troublemaker,
		1002,
		Role.Beholder,
	]);
});
