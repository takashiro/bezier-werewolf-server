import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import ActionType from '../../game/ActionType';
import MutexType from '../../game/MutexType';

import TransformAction from '../TransformAction';
import VisionSkill from '../VisionSkill';

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
