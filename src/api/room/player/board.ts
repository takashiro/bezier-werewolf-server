import {
	Artifact,
	Role,
	Vision,
	Player as PlayerProfile,
} from '@bezier/werewolf-core';
import { Router } from 'express';

import Driver from '../../../game/Driver';
import DriverState from '../../../game/DriverState';
import Player from '../../../game/Player';
import $ from './$';

const router = Router({
	mergeParams: true,
});

function showPlayerTo(player: Player, self: Player): PlayerProfile {
	const profile = player.getProfile();
	if (!player.isRevealed() && !player.isDisclosedTo(self)) {
		profile.role = Role.Unknown;
	}
	const artifactNum = player.getArtifactNum();
	if (artifactNum > 0) {
		if (self === player) {
			profile.artifacts = player.getArtifacts();
		} else {
			profile.artifacts = new Array(artifactNum).fill(Artifact.Unknown);
		}
	}
	if (player.isShielded()) {
		profile.shielded = true;
	}
	return profile;
}

function isSignificant(player: PlayerProfile): boolean {
	return Boolean(player.role || player.artifacts || player.shielded);
}

function wakeUp(self: Player, driver: Driver): Vision {
	const players = driver.getPlayers()
		.map((player) => showPlayerTo(player, self))
		.filter(isSignificant);

	const cards = driver.getCenterCards()
		.filter((card) => card.isRevealed())
		.map((card) => card.getProfile());

	const vision: Vision = {
		players,
		cards,
	};
	return vision;
}

router.get('/', (req, res) => {
	const context = $(req, res);
	if (!context) {
		return;
	}

	const self = context.player;
	const { driver } = context;

	const [skill] = self.getSkills();
	if ((skill && skill.isReady() && !skill.isFinished())) {
		const vision = wakeUp(self, driver);
		res.json(vision);
		return;
	}

	switch (driver.getState()) {
	case DriverState.TakingSeats:
		res.status(425).send('Other players are still taking their seats.');
		return;
	case DriverState.InvokingSkills:
		res.status(425).send('Other players are still invoking their skills.');
		return;
	default: // Voting
		break;
	}

	const vision = wakeUp(self, driver);
	res.json(vision);
});

export default router;
