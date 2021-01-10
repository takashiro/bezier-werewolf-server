import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class MysticWolf extends VisionSkill {
	protected priority = 0x330;

	isFeasible(data: Selection): boolean {
		return Boolean(this.selectPlayer(data));
	}

	show(data: Selection): Vision | undefined {
		const target = this.selectPlayer(data);
		return target && this.showPlayer(target, true);
	}
}
