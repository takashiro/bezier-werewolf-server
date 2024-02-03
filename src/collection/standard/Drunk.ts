import { Selection } from '@bezier/werewolf-core';

import ActionType from '../../game/ActionType.js';
import MutexType from '../../game/MutexType.js';

import ExchangeAction from '../ExchangeAction.js';
import Skill from '../Skill.js';
import SkipAction from '../SkipAction.js';

class Drunk extends Skill<void> {
	protected priority = 0x800;

	protected writeMode = [MutexType.ActualRole];

	isFeasible(data: Selection): boolean {
		if (!this.validateAction(ActionType.MoveRole, this.owner)) {
			return true;
		}
		return Boolean(this.selectCard(data));
	}

	protected run(data: Selection): void {
		const card = this.selectCard(data);
		if (card && this.validateAction(ActionType.MoveRole, this.owner)) {
			this.driver.addAction(new ExchangeAction(this, this.owner, card));
		} else {
			this.driver.addAction(new SkipAction(this));
		}
	}
}

export default Drunk;
