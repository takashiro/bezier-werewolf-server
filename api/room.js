
const HttpError = require('../core/HttpError');
const Room = require('../core/Room');
const Role = require('../game/Role');
const GameDriver = require('../game/Driver');

function POST(params, input) {
	if (!input.roles || !(input.roles instanceof Array)) {
		throw new HttpError(400, 'Invalid roles parameter');
	}

	if (input.roles.length < 5) {
		throw new HttpError(400, 'At least 5 roles must be selected');
	}

	if (input.roles.length > 100) {
		throw new HttpError(400, 'Too many roles');
	}

	let roles = input.roles.map(Role.fromNum).filter(role => role !== Role.Unknown);
	if (roles.length < 5) {
		throw new HttpError(400, 'Too many invalid roles');
	}

	const lobby = this.getLobby();
	if (!lobby.isAvailable()) {
		throw new HttpError(500, 'Too many rooms');
	}

	const room = new Room;
	if (!lobby.add(room)) {
		throw new HttpError(500, 'Too many rooms');
	}

	const driver = new GameDriver;
	room.setDriver(driver);
	driver.setRoles(roles);
	driver.start();

	return {
		id: room.id,
		ownerKey: room.ownerKey,
		roles: driver.roles.map(role => role.toNum()),
	};
}

function GET(params) {
	const id = parseInt(params && params.id, 10);
	if (isNaN(id) || id <= 0) {
		throw new HttpError(400, 'Invalid room id');
	}

	const lobby = this.getLobby();
	const room = lobby.get(id);
	if (!room) {
		throw new HttpError(404, 'The room does not exist');
	}

	const driver = room.getDriver();
	return {
		id: room.id,
		roles: driver.roles.map(role => role.toNum()),
	};
}

function DELETE(params) {
	const id = parseInt(params && params.id, 10);
	if (isNaN(id) || id <= 0) {
		throw new HttpError(400, 'Invalid room id');
	}

	const lobby = this.getLobby();
	const room = lobby.get(id);
	if (!room || room.ownerKey !== params.ownerKey) {
		throw new HttpError(404, 'The room does not exist');
	}

	if (!lobby.remove(id)) {
		throw new HttpError(404, 'The room does not exist');
	}

	return {id};
}

module.exports = {POST, GET, DELETE};
