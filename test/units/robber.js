
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');

class RobberTest extends UnitTest {

	constructor() {
		super('Test robber skill');
	}

	async run() {
		// Configure roles
		const roles = [];
		for (let i = 0; i < 4; i++) {
			roles.push(Role.Robber.value);
		}
		for (let i = 0; i < 40; i++) {
			const role = Math.floor(Math.random() * (Role.enums.length - 1)) + 1;
			if (role !== Role.Robber.value) {
				roles.push(role);
			}
		}

		// Create a room
		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		const players = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.get('role', {id: room.id, seat, seatKey: 1});
			const player = await this.getJSON();
			players.push(player);
		}

		const robber = players.find(player => player.role === Role.Robber.value);
		const auth = {id: room.id, seat: robber.seat, seatKey: 1};

		// Validate user input
		await this.post('skill', auth, {});
		await this.assertError(400, 'Invalid skill targets');

		// Non-existing target
		await this.post('skill', auth, {player: playerNum + 1});
		await this.assertError(400, 'Invalid skill targets');

		// Disallow robbing oneself
		await this.post('skill', auth, {player: robber.seat});
		await this.assertError(400, 'Invalid skill targets');

		// Rob other's role
		let target = 0;
		do {
			target = Math.floor(Math.random() * playerNum) + 1;
		} while (target === robber.seat);
		console.log('Rob ' + target);
		await this.post('skill', auth, {player: target});
		let robbed = await this.getJSON();

		// Reveal all roles
		for (const player of players) {
			await this.post('lynch', {id: room.id, seat: player.seat, seatKey: 1}, {target: 1});
		}
		await this.get('lynch', {id: room.id});
		const board = await this.getJSON();

		assert(board.players[robber.seat - 1].role === robbed.players[0].role);
		assert(board.players[target - 1].role === robber.role);

		// Clean up
		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = RobberTest;
