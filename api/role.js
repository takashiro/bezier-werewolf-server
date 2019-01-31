
const HttpError = require('../core/HttpError');
const Timing = require('../game/Timing');

function GET(params) {
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
		player.setSeatKey(seatKey);
	}
	if (seatKey !== player.getSeatKey()) {
		throw new HttpError(409, 'The seat has been taken');
	}

	let data = {
		seat: player.getSeat(),
		role: player.getRole().toNum(),
	};
	driver.trigger(Timing.ShowRole, player, data);
	return data;
}

function POST(params, input) {
}

module.exports = {GET, POST};
