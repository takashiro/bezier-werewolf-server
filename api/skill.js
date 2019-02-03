
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

	const skill = player.getProactiveSkill();
	if (!skill) {
		throw new HttpError(404, 'No skill for your role');
	}

	if (!skill.isFeasible(driver, player, input)) {
		throw new HttpError(400, 'Invalid skill targets');
	}

	return skill.takeEffect(driver, player, input);
}

module.exports = {POST};
