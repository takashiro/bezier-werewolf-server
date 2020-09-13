import { Router } from 'express';
import { Player } from '@bezier/werewolf-core';

import { lobby } from '../../../base/Lobby';
import GameDriver from '../../../game/Driver';

const router = Router({
	mergeParams: true,
});

router.get('/', (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	if (Number.isNaN(id) || id <= 0) {
		res.status(400).send('Invalid room id');
		return;
	}

	const seat = Number.parseInt(req.params.seat, 10);
	if (Number.isNaN(seat) || seat <= 0) {
		res.status(400).send('Invalid seat number');
		return;
	}

	const { seatKey } = req.query;
	if (!seatKey || typeof seatKey !== 'string') {
		res.status(400).send('Seat key cannot be empty');
		return;
	}

	const room = lobby.get(id);
	if (!room) {
		res.status(404).send('The room does not exist');
		return;
	}

	const driver = room.getDriver();
	if (!driver || !(driver instanceof GameDriver)) {
		res.status(500).send('Game driver is not loaded');
		return;
	}

	const player = driver.getPlayer(seat);
	if (!player) {
		res.status(404).send('The seat does not exist');
		return;
	}

	if (!player.getSeatKey()) {
		player.setSeatKey(seatKey);
	}
	if (seatKey !== player.getSeatKey()) {
		res.status(409).send('The seat has been taken');
	}

	const profile: Player = {
		seat: player.getSeat(),
		role: player.getRole(),
	};
	res.json(profile);
});

export default router;
