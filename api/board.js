
const HttpError = require('../core/HttpError');

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
	const players = driver.players.map(function (player) {
		const seatKey = player.getSeatKey();
		const skill = player.getProactiveSkill();
		return {
			seat: player.getSeat(),
			ready: Boolean(seatKey && (!skill || skill.isUsed())),
		};
	});

	return {players};
}

module.exports = {GET};
