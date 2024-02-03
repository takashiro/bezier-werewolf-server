import {
	Selection,
	Team,
	Teamship,
	Vision,
} from '@bezier/werewolf-core';
import ActionType from '../../game/ActionType.js';

import MutexType from '../../game/MutexType.js';
import RevealAction from '../RevealAction.js';
import SkipAction from '../SkipAction.js';
import VisionSkill from '../VisionSkill.js';

export default class Revealer extends VisionSkill {
	protected priority = 0x1a00;

	protected readMode = [MutexType.ActualRole];

	protected writeMode = [MutexType.Any];

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		if (!target) {
			return false;
		}
		return this.validateAction(ActionType.ViewRole, target);
	}

	protected show(data: Selection): Vision | undefined {
		const target = this.selectPlayer(data);
		if (!target) {
			return;
		}

		const team = Teamship.get(target.getRole());
		if (team === Team.Villager) {
			this.driver.addAction(new RevealAction(this, target));
		} else {
			this.driver.addAction(new SkipAction(this));
		}

		return this.showPlayer(target);
	}
}
