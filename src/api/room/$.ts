import {
	Request,
	Response,
} from 'express';

import { lobby } from '../../base/Lobby';
import Room from '../../base/Room';

export default function parse(req: Request, res: Response): Room | undefined {
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

	return room;
}
