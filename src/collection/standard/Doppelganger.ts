import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import ActionType from '../../game/ActionType.js';
import MutexType from '../../game/MutexType.js';

import TransformAction from '../TransformAction.js';
import VisionSkill from '../VisionSkill.js';

export default class Doppelganger extends VisionSkill {
	protected priority = -0x700;

	protected readMode = [MutexType.ActualRole];

	protected writeMode = [MutexType.NotionalRole, MutexType.ActualRole];

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

		const {
			driver,
			owner,
		} = this;
		const role = target.getRole();
		owner.setNotionalRole(role);
		driver.addAction(new TransformAction(this, owner, role));
		driver.giftPlayer(owner, role);
		return this.showPlayer(target);
	}
}
