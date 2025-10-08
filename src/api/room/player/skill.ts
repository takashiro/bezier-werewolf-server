import { Router } from 'express';
import type { Selection } from '@bezier/werewolf-core';

import $ from './$.js';

interface PathParams {
	idx?: string;
}

const router = Router({
	mergeParams: true,
});

function parseSkillIndex({ idx }: PathParams): number {
	if (!idx) {
		return 0;
	}
	const n = Number.parseInt(idx, 10);
	return n || 0;
}

router.post('/{:idx}', (req, res) => {
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

	const idx = parseSkillIndex(req.params);
	const skill = skills[idx];
	if (!skill) {
		res.status(404).send('Skill not found');
		return;
	}

	if (!skill.isReady()) {
		res.status(425).send('Skill not ready');
		return;
	}

	const body = req.body as Selection ?? {};
	if (!skill.isFeasible(body)) {
		res.status(400).send('Invalid skill targets');
		return;
	}

	const output = skill.exec(body);
	if (skills.every((sk) => sk.isFinished())) {
		player.setReady(true);
	}
	res.json(output);
});

export default router;
