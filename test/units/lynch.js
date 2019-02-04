
const assert = require('assert');
const UnitTest = require('../UnitTest');
const Role = require('../../game/Role');
const shuffle = require('../../util/shuffle');

class LynchTest extends UnitTest {

	constructor() {
		super('Test lynch');
	}

	async run() {
		const roles = new Array(20);
		for (let i = 0; i < 20; i++) {
			roles[i] = Math.floor(Math.random() * (Role.enums.length - 1)) + 1;
		}
		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		await this.post('lynch');
		await this.assertError(400, 'Invalid room id');

		await this.post('lynch', {id: 1000}, {});
		await this.assertError(400, 'Invalid seat number');

		await this.post('lynch', {id: 1000, seat: 1000}, {});
		await this.assertError(400, 'Invalid seat key');

		await this.post('lynch', {id: room.id, seat: 1, seatKey: 1}, {});
		await this.assertError(400, 'Invalid target seat number');

		await this.post('lynch', {id: 1000, seat: 1, seatKey: 1}, {target: 1});
		await this.assertError(404, 'The room does not exist');

		await this.post('lynch', {id: room.id, seat: playerNum + 1, seatKey: 1}, {target: 1000});
		await this.assertError(404, 'The seat does not exist');

		await this.post('lynch', {id: room.id, seat: 1, seatKey: 1}, {target: 1000});
		await this.assertError(403, 'The seat has not been taken');

		await this.get('lynch');
		await this.assertError(400, 'Invalid room id');

		await this.get('lynch', {id: 1000});
		await this.assertError(404, 'The room does not exist');

		const players = [];
		const seats = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			seats.push(seat);
			await this.get('role', {id: room.id, seat, seatKey: 1});
			const player = await this.getJSON();
			players.push(player);
		}

		await this.post('lynch', {id: room.id, seat: 1000, seatKey: 1}, {});
		await this.assertError(400, 'Invalid target seat number');

		await this.post('lynch', {id: room.id, seat: 1, seatKey: 4}, {target: 1000});
		await this.assertError(403, 'Invalid seat key');

		await this.post('lynch', {id: room.id, seat: 1, seatKey: 1}, {target: 1000});
		await this.assertError(400, 'The target does not exist');

		shuffle(seats);
		let votes = new Map;
		let lynchResult = null;
		for (let seat of seats) {
			const target = Math.floor(Math.random() * playerNum) + 1;
			votes.set(seat, target);

			await this.post('lynch', {id: room.id, seat, seatKey: 1}, {target});
			await this.get('lynch', {id: room.id});
			lynchResult = await this.getJSON();
			for (const r of lynchResult) {
				assert(votes.get(r.seat) === r.target);
				if (votes.size < playerNum) {
					assert(!r.role);
				} else {
					const p = players[r.seat - 1];
					assert(p);
					assert(p.role === r.role);
				}
			}
		}

		assert(lynchResult.length === players.length);

		await this.post('lynch', {id: room.id, seat: 1, seatKey: 1}, {target: 1000});
		await this.assertError(400, 'You have submitted your lynch target');

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = LynchTest;
