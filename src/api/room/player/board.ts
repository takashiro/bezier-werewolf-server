import { Vision } from '@bezier/werewolf-core';
import { Router } from 'express';

import DriverState from '../../../game/DriverState';
import $ from './$';

const router = Router({
	mergeParams: true,
});

router.get('/', (req, res) => {
	const context = $(req, res);
	if (!context) {
		return;
	}

	const { driver } = context;
	if (driver.getState() !== DriverState.Voting) {
		res.status(425).send('Other players are still invoking their skills.');
		return;
	}

	const self = context.player;
	const players = driver.getPlayers().filter((player) => player.isRevealed() || player.isDisclosedTo(self));
	const cards = driver.getCenterCards().filter((card) => card.isRevealed());

	const vision: Vision = {
		players: players.map((player) => player.getProfile()),
		cards: cards.map((card) => card.getProfile()),
	};
	res.json(vision);
});

export default router;
