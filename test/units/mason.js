
const assert = require('assert');
const UnitTest = require('../UnitTest');

const Role = require('../../game/Role');

class MasonTest extends UnitTest {

	constructor() {
		super('Test Mason skill');
	}

	async run() {
		const roles = [];
		for (let i = 0; i < 5; i++) {
			roles.push(Role.Mason.value);
		}
		for (let i = 0; i < 25; i++) {
			roles.push(Math.floor(Math.random() * (Role.enums.length - 1)) + 1);
		}

		// Create room
		await this.post('room', {roles});
		const room = await this.getJSON();
		const playerNum = roles.length - 3;

		// Fetch roles
		const players = [];
		for (let seat = 1; seat <= playerNum; seat++) {
			await this.get('role', {id: room.id, seat, seatKey: 1});
			const my = await this.getJSON();
			players.push(my);
		}

		const masons = players.filter(player => player.role === Role.Mason.value);

		// Check Mason's vision
		for (const mason of masons) {
			await this.post('skill', {id: room.id, seat: mason.seat, seatKey: 1}, {});
			const vision = await this.getJSON();
			assert(vision.players);
			assert(vision.players.length === masons.length);

			for (let i = 0; i < masons.length; i++) {
				assert(masons[i].seat === vision.players[i].seat);
			}
		}

		await this.delete('room', room);
		await this.assertJSON({id: room.id});
	}

}

module.exports = MasonTest;
