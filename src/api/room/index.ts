import { Router } from 'express';
import { Role } from '@bezier/werewolf-core';

import { lobby } from '../../base/Lobby';
import Room from '../../base/Room';
import GameDriver from '../../game/Driver';

import boardRouter from './board';
import playerRouter from './player';

const router = Router();

router.use('/:id/board', boardRouter);
router.use('/:id/player', playerRouter);

router.post('/', (req, res) => {
	const input = req.body;
	let { roles } = input;
	if (!roles || !Array.isArray(roles)) {
		res.status(400).send('Invalid roles parameter');
		return;
	}

	if (roles.length < 5) {
		res.status(400).send('At least 5 roles must be selected');
		return;
	}

	if (roles.length > 100) {
		res.status(400).send('Too many roles');
		return;
	}

	roles = roles.filter((role) => Role[role] && role !== Role.Unknown) as Role[];
	if (roles.length < 5) {
		res.status(400).send('Too many invalid roles');
		return;
	}

	const room = new Room();
	if (!lobby.add(room)) {
		res.status(500).send('Too many rooms');
		return;
	}

	const driver = new GameDriver();
	room.setDriver(driver);
	driver.setRoles(roles);
	driver.prepare();

	const meta = room.toJSON();
	meta.ownerKey = room.getOwnerKey();
	res.json(meta);
});

router.get('/:id', (req, res) => {
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

	res.json(room.toJSON());
});

router.delete('/:id', (req, res) => {
	const id = Number.parseInt(req.params.id, 10);
	if (Number.isNaN(id) || id <= 0) {
		res.status(400).send('Invalid room id');
		return;
	}

	const room = lobby.get(id);
	if (!room || room.getOwnerKey() !== req.params.ownerKey) {
		res.status(404).send('The room does not exist');
		return;
	}

	if (!lobby.remove(id)) {
		res.status(404).send('The room does not exist');
		return;
	}

	res.sendStatus(200);
});

export default router;
