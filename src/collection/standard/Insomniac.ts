import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class Insomniac extends VisionSkill {
	protected priority = 0x1900;

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		return Insomniac.showPlayer(this.owner, true);
	}
}
