
const assert = require('assert');
const UnitTest = require('../UnitTest');

class FetchRoleTest extends UnitTest {

	constructor() {
		super('Fetch a role');
	}

	async run() {
		console.log('Create a room');
		const roles = [1, 1, 2, 2, 1, 2, 2, 2];
		await this.post('room', {roles});
		const room = await this.getJSON();

		console.log('Test invalid inputs');
		await this.get('role');
		await this.assertError(400, 'Invalid room id');
		await this.get('role', {id: room.id});
		await this.assertError(400, 'Invalid seat number');
		await this.get('role', {id: room.id, seat: 'invalid'});
		await this.assertError(400, 'Invalid seat number');
		await this.get('role', {id: room.id, seat: 1});
		await this.assertError(400, 'Invalid seat key');
		await this.get('role', {id: room.id, seat: 1, seatKey: 'Invalid'});
		await this.assertError(400, 'Invalid seat key');

		console.log('Fetch roles');
		const playerNum = roles.length - 3;
		let players = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.get('role', {id: room.id, seat: seat, seatKey: seat});
			let player = await this.getJSON();
			assert(player.seat === seat);
			assert(player.role);
			players.push(player);
		}

		console.log('Fetch roles again');
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.get('role', {id: room.id, seat: seat, seatKey: seat + 1});
			await this.assertError(409, 'The seat has been taken');

			await this.get('role', {id: room.id, seat: seat, seatKey: seat});
			let player = await this.getJSON();
			assert(player.seat === seat);
			assert(player.role === players[seat - 1].role);
			assert(roles.indexOf(player.role) >= 0);
		}

		console.log('Test invalid seat numbers');
		for (let i = 1; i <= 3; i++) {
			let seat = playerNum + i;
			await this.get('role', {id: room.id, seat, seatKey: seat});
			await this.assertError(404, 'The seat does not exist');
		}

		console.log('Clean up');
		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = FetchRoleTest;
