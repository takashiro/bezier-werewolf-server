import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';
import ActionType from '../../game/ActionType';

import MutexType from '../../game/MutexType';
import ExchangeAction from '../ExchangeAction';
import VisionSkill from '../VisionSkill';

export default class Robber extends VisionSkill {
	protected priority = 0x600;

	protected readMode = [MutexType.ActualRole];

	protected writeMode = [MutexType.ActualRole];

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		if (!target || target === this.owner) {
			return false;
		}
		return this.validateAction(ActionType.ViewRole, target) && this.validateAction(ActionType.MoveRole, target);
	}

	protected show(data: Selection): Vision | undefined {
		const target = this.selectPlayer(data);
		if (!target) {
			return;
		}

		const victim = this.showPlayer(target);
		this.driver.addAction(new ExchangeAction(this, this.owner, target));
		return victim;
	}
}
