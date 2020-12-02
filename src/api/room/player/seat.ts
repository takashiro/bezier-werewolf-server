import { Router } from 'express';
import { Player } from '@bezier/werewolf-core';

import $ from './$';

const router = Router({
	mergeParams: true,
});

router.get('/', (req, res) => {
	const context = $(req, res, false);
	if (!context) {
		return;
	}

	const { player } = context;
	const profile: Player = {
		seat: player.getSeat(),
		role: player.getRolle(),
	};
	res.json(profile);
});

export default router;
