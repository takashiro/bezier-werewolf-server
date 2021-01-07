import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';

export default class ApprenticeSeer extends VisionSkill {
	protected priority = 0x1520;

	isFeasible(data: Selection): boolean {
		return Boolean(this.selectCard(data));
	}

	protected show(data: Selection): Vision | undefined {
		const card = this.selectCard(data);
		return card && ApprenticeSeer.showCard(card);
	}
}
