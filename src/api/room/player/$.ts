import {
	Request,
	Response,
} from 'express';

import Room from '../../../base/Room.js';
import Driver from '../../../game/Driver.js';
import Player from '../../../game/Player.js';

import parseRoom from '../$.js';

interface PlayerContext {
	room: Room;
	player: Player;
	driver: Driver;
}

export default function parse(req: Request, res: Response, readonly = true): PlayerContext | undefined {
	const room = parseRoom(req, res);
	if (!room) {
		return;
	}

	const seat = Number.parseInt(req.params.seat, 10);
	if (Number.isNaN(seat) || seat <= 0) {
		res.status(400).send('Invalid seat number');
		return;
	}

	const { seatKey } = req.query;
	if (!seatKey || typeof seatKey !== 'string') {
		res.status(401).send('Seat key cannot be empty');
		return;
	}

	const driver = room.getDriver();
	if (!driver || !(driver instanceof Driver)) {
		res.status(500).send('Game driver is not loaded');
		return;
	}

	const player = driver.getPlayer(seat);
	if (!player) {
		res.status(404).send('The seat does not exist');
		return;
	}

	if (!player.getSeatKey()) {
		if (readonly) {
			res.status(403).send('The seat has not been taken');
			return;
		}
		player.setSeatKey(seatKey);
	}

	if (seatKey !== player.getSeatKey()) {
		if (readonly) {
			res.status(403).send('Invalid seat key');
		} else {
			res.status(409).send('The seat has been taken');
		}
		return;
	}

	return {
		room,
		driver,
		player,
	};
}
