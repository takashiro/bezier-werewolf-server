
function GET() {
	const lobby = this.getLobby();
	return lobby.getStatus();
}

module.exports = {GET};
