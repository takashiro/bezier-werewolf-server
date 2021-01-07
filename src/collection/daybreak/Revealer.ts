import {
	Selection,
	Team,
	Teamship,
	Vision,
} from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import RevealAction from '../RevealAction';
import VisionSkill from '../VisionSkill';

export default class Revealer extends VisionSkill {
	protected priority = 0x1a00;

	protected mode = SkillMode.ReadWrite;

	isFeasible(data: Selection): boolean {
		return Boolean(this.selectPlayer(data));
	}

	protected show(data: Selection): Vision | undefined {
		const target = this.selectPlayer(data);
		if (!target) {
			return;
		}

		const team = Teamship.get(target.getRole());
		if (team === Team.Villager) {
			this.driver.addAction(new RevealAction(this, target));
		}

		return Revealer.showPlayer(target, true);
	}
}
