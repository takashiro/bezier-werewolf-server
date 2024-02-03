import { Router } from 'express';
import {
	LynchResult,
	Progress,
	Vote,
} from '@bezier/werewolf-core';

import DriverState from '../../../game/DriverState.js';

import $ from './$.js';

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
	if (driver.getState() < DriverState.Voting) {
		res.status(425).send('Too early to vote. Other players are still invoking their skills.');
		return;
	}

	if (player.hasVoted()) {
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
	if (driver.getState() < DriverState.Voting) {
		res.status(425).send('Other players are still invoking their skills.');
		return;
	}

	const playerNum = driver.getPlayers().length;
	const votes: Vote[] = [];
	for (const source of driver.getPlayers()) {
		const target = source.getLynchTarget();
		if (target) {
			votes.push({
				source: source.getSeat(),
				target: target.getSeat(),
			});
		}
	}

	const progress: Progress = {
		current: votes.length,
		limit: playerNum,
	};
	const output: LynchResult = {
		progress,
	};

	if (progress.current >= progress.limit) {
		output.votes = votes;
	}

	res.json(output);
});

export default router;
