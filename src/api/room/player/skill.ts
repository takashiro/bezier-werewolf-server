import { Router } from 'express';

import ProactiveSkill from '../../../game/ProactiveSkill';

import $ from './$';

const router = Router({
	mergeParams: true,
});

router.post('/', (req, res) => {
	const context = $(req, res);
	if (!context) {
		return;
	}

	const { player } = context;
	const skill = player.getSkill();
	if (!skill || !(skill instanceof ProactiveSkill)) {
		player.setReady(true);
		res.sendStatus(200);
		return;
	}

	if (!skill.isInvoked(req.body)) {
		if (!skill.isFeasible(req.body)) {
			res.status(400).send('Invalid skill targets');
			return;
		}

		skill.invoke(req.body);
	}

	res.json(skill.getOutput());
});

export default router;
