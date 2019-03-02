
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');

class AlphaWolfTest extends UnitTest {

	constructor() {
		super('Test alpha wolf');
	}

	async run() {
		// Configure roles
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.AlphaWolf.value);
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

		// Invoke alpha wolf skill
		let target = 0;
		for (let seat = 1; seat <= playerNum; seat++) {
			const player = players[seat - 1];
			if (player.role !== Role.AlphaWolf.value) {
				continue;
			}

			const auth = {id: room.id, seat, seatKey: 1};

			console.log('Test invalid card targets');
			await this.post('skill', auth, {card: 3});
			await this.assertError(400, 'Invalid skill targets');

			console.log('Test invalid player target: 0');
			await this.post('skill', auth, {player: 0});
			await this.assertError(400, 'Invalid skill targets');

			console.log('Test invalid player target: self');
			await this.post('skill', auth, {player: seat});
			await this.assertError(400, 'Invalid skill targets');

			do {
				target = Math.floor(Math.random() * playerNum) + 1;
			} while (target === seat);
			console.log(`Transform player ${target} into a werewolf`);
			await this.post('skill', auth, {player: target});
			await this.assertOk();

			break;
		}

		// Vote and see lync result
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.post('lynch', {id: room.id, seat, seatKey: 1}, {target: 1});
		}
		await this.get('lynch', {id: room.id});
		const board = await this.getJSON();

		assert(board.players.length > 0);
		for (const player of board.players) {
			const baseline = players[player.seat - 1];
			if (player.seat === target) {
				assert(player.role === Role.Werewolf.value);
				console.log(`Player ${player.seat} is a werewolf`);
			} else {
				assert(player.role === baseline.role);
			}
		}

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = AlphaWolfTest;
