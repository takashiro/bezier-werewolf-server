
const HttpError = require('../core/HttpError');

function POST(params, input) {
	const id = parseInt(params && params.id, 10);
	if (isNaN(id) || id <= 0) {
		throw new HttpError(400, 'Invalid room id');
	}

	const seat = parseInt(params.seat, 10);
	if (isNaN(seat) || seat <= 0) {
		throw new HttpError(400, 'Invalid seat number');
	}

	const seatKey = parseInt(params.seatKey, 10);
	if (isNaN(seatKey)) {
		throw new HttpError(400, 'Invalid seat key');
	}

	const target = parseInt(input && input.target, 10);
	if (isNaN(target) || target <= 0) {
		throw new HttpError(400, 'Invalid target seat number');
	}

	const lobby = this.getLobby();
	const room = lobby.get(id);
	if (!room) {
		throw new HttpError(404, 'The room does not exist');
	}

	const driver = room.getDriver();
	const player = driver.getPlayer(seat);
	if (!player) {
		throw new HttpError(404, 'The seat does not exist');
	}
	if (!player.getSeatKey()) {
		throw new HttpError(403, 'The seat has not been taken');
	}
	if (player.getSeatKey() !== seatKey) {
		throw new HttpError(403, 'Invalid seat key');
	}

	if (player.getLynchTarget()) {
		throw new HttpError(400, 'You have submitted your lynch target');
	}

	const lynchTarget = driver.getPlayer(target);
	if (!lynchTarget) {
		throw new HttpError(400, 'The target does not exist');
	}

	player.setLynchTarget(lynchTarget);
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
	const players = driver.players;
	const done = players.every(player => player.getLynchTarget());

	let output = [];
	for (const player of players) {
		const target = player.getLynchTarget();
		if (target) {
			output.push({
				seat: player.seat,
				target: target ? target.seat : 0,
				role: done ? player.role.toNum() : 0,
			});
		}
	}
	return output;
}

module.exports = {POST, GET};
