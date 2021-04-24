import { Selection } from '@bezier/werewolf-core';

import ActionType from '../../game/ActionType';
import MutexType from '../../game/MutexType';

import ExchangeAction from '../ExchangeAction';
import Skill from '../Skill';
import SkipAction from '../SkipAction';

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
