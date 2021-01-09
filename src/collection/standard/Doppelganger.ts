import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import TransformAction from '../TransformAction';
import VisionSkill from '../VisionSkill';

export default class Doppelganger extends VisionSkill {
	protected priority = 0x0700;

	protected mode = SkillMode.ReadWrite;

	isFeasible(data: Selection): boolean {
		return Boolean(this.selectPlayer(data));
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
		return this.showPlayer(target, true);
	}
}
