
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
	driver.setRoles(roles);

	return {
		id: room.id,
		ownerKey: room.ownerKey,
		roles: driver.roles.map(role => role.toNum()),
	};
}

function GET(params) {
}

function DELETE(params) {
}

module.exports = {POST, GET, DELETE};
