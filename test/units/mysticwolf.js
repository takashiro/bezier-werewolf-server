
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

class MysticWolfTest extends UnitTest {

	constructor() {
		super('Test mystic wolf');
	}

	async run() {
		// Configure roles
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.MysticWolf.value);
		}
		for (let i = 0; i < 20; i++) {
			roles.push(Math.floor(Math.random() * (Role.enums.length - 1)) + 1);
		}

		// Create a room
		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		// Fetch all roles
		const players = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			const auth = {id: room.id, seat, seatKey: 1};
			await this.get('role', auth);
			const player = await this.getJSON();
			players.push(player);
		}

		// Invoke mystic wolf skill
		let target = 0;
		let targetRole = 0;
		let werewolves = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			const player = players[seat - 1];
			if (player.role !== Role.MysticWolf.value) {
				continue;
			}

			const auth = {id: room.id, seat, seatKey: 1};

			console.log('See other werewolves');
			await this.post('skill', auth, {});
			const vision = await this.getJSON();
			werewolves = vision.players;
			assert(werewolves.length > 0);

			console.log('Test duplicate request');
			await this.post('skill', auth, {card: 3});
			const vision2 = await this.getJSON();
			const w1 = vision.players.map(player => player.seat);
			const w2 = vision2.players.map(player => player.seat);
			assert(w1.length == w2.length);
			for (let i = 0; i < w1.length; i++) {
				assert(w1[i] === w2[i]);
			}

			console.log('Test invalid player target: self');
			await this.post('skill', auth, {player: seat});
			await this.assertError(400, 'Invalid skill targets');

			// See a player
			do {
				target = Math.floor(Math.random() * playerNum) + 1;
			} while (target === seat || werewolves.find(wolf => wolf.seat === target));
			console.log(`See the role of Player ${target}`);
			await this.post('skill', auth, {player: target});
			const vision3 = await this.getJSON();
			assert(vision3.players.length === 1);
			targetRole = vision3.players[0].role;

			break;
		}

		console.log('Vote and see lync result');
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.post('lynch', {id: room.id, seat, seatKey: 1}, {target: 1});
		}
		await this.get('lynch', {id: room.id});
		const board = await this.getJSON();

		console.log(`Confirm the foreseen player ${target}`);
		assert(board.players.length > 0);
		for (const player of board.players) {
			const baseline = players[player.seat - 1];
			if (player.seat === target) {
				assert(player.role === targetRole);
			} else {
				assert(player.role === baseline.role);
			}
		}

		console.log('Confirm other werewolves');
		for (const p1 of werewolves) {
			const p2 = board.players[p1.seat - 1];
			assert(p2.role === p1.role);
		}

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = MysticWolfTest;
