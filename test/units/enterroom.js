
const assert = require('assert');
const UnitTest = require('../UnitTest');

class EnterRoomTest extends UnitTest {

	constructor() {
		super('Enter room');
	}

	async run() {
		console.log('Create a room');
		const roles = [1, 1, 2, 2, 1, 2, 2, 2];
		await this.post('room', {roles});
		const created_room = await this.getJSON();

		console.log('Enter the room');
		await this.get('room', {id: created_room.id});
		const room = await this.getJSON();

		console.log('Check role config');
		assert(created_room.id === room.id);
		assert(room.roles.length === roles.length);
		for (let i = 0; i < roles.length; i++) {
			assert(roles[i] === room.roles[i]);
		}

		console.log('Clean up');
		await this.delete('room', {id: room.id, ownerKey: created_room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = EnterRoomTest;
