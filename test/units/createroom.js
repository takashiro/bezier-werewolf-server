
const Role = require('../../game/Role');

const assert = require('assert');
const UnitTest = require('../UnitTest');

class CreateRoomTest extends UnitTest {

	constructor() {
		super('Create rooms');
	}

	async run() {
		console.log('Test invalid inputs');
		await this.post('room');
		await this.assertError(400, 'Invalid roles parameter');

		await this.post('room', {test: 1});
		await this.assertError(400, 'Invalid roles parameter');

		await this.post('room', {roles: [1234, 5678]});
		await this.assertError(400, 'At least 5 roles must be selected');

		await this.post('room', {roles: [1, 1001, 1002, 1003, 1004, 1005]});
		await this.assertError(400, 'Too many invalid roles');

		console.log('Create a room');
		let roles = [Role.Werewolf, Role.Werewolf, Role.Villager, Role.Villager, Role.Villager];
		roles = roles.map(role => role.toNum());
		await this.post('room', {roles});
		let room = await this.getJSON();
		assert(room.id);
		assert(room.key);
		assert(room.roles && room.roles instanceof Array);
		assert(room.roles.length === roles.length);
		roles.sort();
		room.roles.sort();
		for (let i = 0; i < roles.length; i++) {
			assert(roles[i] === room.roles[i]);
		}

		await this.delete('room', {id: room.id});
		await this.assertError(404, 'The room does not exist');

		await this.delete('room', {id: room.id, ownerKey: room.ownerKey});
		await this.assertJSON({id: room.id});
	}

}

module.exports = CreateRoomTest;
