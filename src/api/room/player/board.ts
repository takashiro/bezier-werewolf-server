import {
	Artifact,
	Role,
	Vision,
} from '@bezier/werewolf-core';
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
	const players = driver.getPlayers()
		.map((player) => {
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
			return profile;
		})
		.filter((player) => player.role || player.artifacts);

	const cards = driver.getCenterCards()
		.filter((card) => card.isRevealed())
		.map((card) => card.getProfile());

	const vision: Vision = {
		players,
		cards,
	};
	res.json(vision);
});

export default router;
