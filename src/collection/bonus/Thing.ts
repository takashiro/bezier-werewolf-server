import { Selection } from '@bezier/werewolf-core';

import MutexType from '../../game/MutexType.js';
import DiscloseAction from '../DiscloseAction.js';
import Skill from '../Skill.js';
import SkipAction from '../SkipAction.js';

export default class Thing extends Skill<void> {
	protected priority = 0x410;

	protected writeMode = [MutexType.Any];

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		if (!target) {
			return false;
		}
		return this.driver.getDistance(target, this.owner) === 1;
	}

	protected run(data: Selection): void {
		const target = this.selectPlayer(data);
		if (target) {
			this.driver.addAction(new DiscloseAction(this, this.owner, target));
		} else {
			this.driver.addAction(new SkipAction(this));
		}
	}
}
