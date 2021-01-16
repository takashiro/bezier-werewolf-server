import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import MutexType from '../../game/MutexType';
import VisionSkill from '../VisionSkill';

export default class ApprenticeSeer extends VisionSkill {
	protected priority = 0x520;

	protected readMode = [MutexType.ActualRole];

	isFeasible(data: Selection): boolean {
		return Boolean(this.selectCard(data));
	}

	protected show(data: Selection): Vision | undefined {
		const card = this.selectCard(data);
		return card && this.showCard(card);
	}
}
