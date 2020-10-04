import { Router } from 'express';
import { LynchVote } from '@bezier/werewolf-core';

import DriverState from '../../../game/DriverState';

import $ from './$';

const router = Router({
	mergeParams: true,
});

router.post('/', (req, res) => {
	const context = $(req, res);
	if (!context) {
		return;
	}

	const target = Number.parseInt(req.body.target, 10);
	if (Number.isNaN(target) || target <= 0) {
		res.status(400).send('Invalid target seat number');
		return;
	}

	const { player, driver } = context;
	if (driver.getState() !== DriverState.Voting) {
		res.status(425).send('Too early to vote. Other players are still invoking their skills.');
		return;
	}

	if (player.getLynchTarget()) {
		res.status(409).send('You have submitted your lynch target');
		return;
	}

	const lynchTarget = driver.getPlayer(target);
	if (!lynchTarget) {
		res.status(400).send('The target does not exist');
		return;
	}

	player.setLynchTarget(lynchTarget);
	res.sendStatus(200);
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

	const playerNum = driver.getPlayers().length;
	const players: LynchVote[] = [];
	for (const player of driver.getPlayers()) {
		const target = player.getLynchTarget();
		if (target) {
			players.push({
				seat: player.getSeat(),
				role: player.getRole(),
				target: target.getSeat(),
			});
		}
	}

	if (players.length < playerNum) {
		res.json({
			progress: players.length,
			limit: playerNum,
		});
	} else {
		const cards = driver.getCenterCards();
		res.json({
			cards: cards.map((card) => card.toJSON()),
			players,
		});
	}
});

export default router;
