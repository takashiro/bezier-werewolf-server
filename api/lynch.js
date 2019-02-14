
const HttpError = require('../core/HttpError');
const Driver = require('../game/Driver');

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
		throw new HttpError(409, 'You have submitted your lynch target');
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
	const driverState = driver.getState();
	let done = false;
	if (driverState === Driver.State.Stopping) {
		driver.end();
		done = true;
	} else if (driverState === Driver.State.Ended) {
		done = true;
	}

	if (done) {
		const players = [];
		for (const player of driver.players) {
			const target = player.getLynchTarget();
			if (target) {
				players.push({
					seat: player.seat,
					target: target ? target.seat : 0,
					role: player.role.toNum(),
				});
			}
		}

		const cards = driver.centerCards.map(card => ({pos: card.pos, role: card.role.toNum()}));
		return {cards, players};
	} else {
		const limit = driver.players.length;
		let progress = 0;
		for (const player of driver.players) {
			if (player.getLynchTarget()) {
				progress++;
			}
		}
		return {progress, limit};
	}
}

module.exports = {POST, GET};
