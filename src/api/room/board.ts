import { Router } from 'express';

import { lobby } from '../../base/Lobby';
import GameDriver from '../../game/Driver';

const router = Router({
	mergeParams: true,
});

router.get('/', (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	if (Number.isNaN(id) || id <= 0) {
		res.status(400).send('Invalid room id');
		return;
	}

	const room = lobby.get(id);
	if (!room) {
		res.status(404).send('The room does not exist');
		return;
	}

	const driver = room.getDriver();
	if (!driver || !(driver instanceof GameDriver)) {
		res.status(404).send('No game driver is loaded');
		return;
	}

	const players = driver.getPlayers();
	res.json(players.map((player) => ({
		seat: player.getSeat(),
		ready: player.isReady(),
	})));
});

export default router;
