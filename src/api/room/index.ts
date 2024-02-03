import { Router } from 'express';
import {
	GameConfig,
	Role,
} from '@bezier/werewolf-core';

import { lobby } from '../../base/Lobby.js';
import Room from '../../base/Room.js';

import GameDriver from '../../game/Driver.js';

import collections from '../../collection/index.js';

import playerRouter from './player/index.js';
import $ from './$.js';

const router = Router();

router.use('/:id/player/:seat', playerRouter);

router.post('/', (req, res) => {
	const options = req.body as GameConfig;
	let { roles } = options;
	if (!roles || !Array.isArray(roles)) {
		res.status(400).send('Invalid roles parameter');
		return;
	}

	if (roles.length < 3) {
		res.status(400).send('At least 3 roles must be selected');
		return;
	}

	if (roles.length > 100) {
		res.status(400).send('Too many roles');
		return;
	}

	roles = roles.filter((role) => role !== Role.Unknown);
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

	if (options.random === false) {
		driver.setRandom(false);
	}

	if (options.loneWolf === true) {
		driver.setLoneWolf(true);
	}

	driver.setRoles(roles);
	driver.loadCollection(...collections);
	driver.prepare();

	const meta = room.toJSON();
	meta.ownerKey = room.getOwnerKey();
	res.json(meta);
});

router.get('/:id', (req, res) => {
	const room = $(req, res);
	if (!room) {
		return;
	}
	res.json(room.toJSON());
});

router.delete('/:id', (req, res) => {
	const room = $(req, res);
	if (!room) {
		return;
	}

	if (room.getOwnerKey() !== req.query.ownerKey) {
		res.status(404).send('The room does not exist');
		return;
	}

	if (!lobby.remove(room.getId())) {
		res.status(404).send('The room does not exist');
		return;
	}

	res.sendStatus(200);
});

export default router;
