import { Router } from 'express';

import $ from './$';

const router = Router({
	mergeParams: true,
});

router.post('/:idx?', (req, res) => {
	const context = $(req, res);
	if (!context) {
		return;
	}

	const { player } = context;
	const skills = player.getSkills();
	if (skills.length <= 0) {
		player.setReady(true);
		res.sendStatus(200);
		return;
	}

	const { idx } = req.params;
	const skill = skills[idx ? (Number.parseInt(idx, 10) || 0) : 0];
	if (!skill) {
		res.status(404).send('Skill not found');
		return;
	}

	if (!skill.isFeasible(req.body)) {
		res.status(400).send('Invalid skill targets');
		return;
	}

	const output = skill.exec(req.body);
	if (skills.every((sk) => sk.isFinished())) {
		player.setReady(true);
	}
	res.json(output);
});

export default router;
