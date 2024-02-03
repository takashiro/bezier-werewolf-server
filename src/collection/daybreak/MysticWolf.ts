import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import ActionType from '../../game/ActionType.js';
import MutexType from '../../game/MutexType.js';

import VisionSkill from '../VisionSkill.js';

export default class MysticWolf extends VisionSkill {
	protected priority = 0x330;

	protected readMode = [MutexType.ActualRole];

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		if (!target) {
			return false;
		}
		return this.validateAction(ActionType.ViewRole, target);
	}

	show(data: Selection): Vision | undefined {
		const target = this.selectPlayer(data);
		return target && this.showPlayer(target);
	}
}
