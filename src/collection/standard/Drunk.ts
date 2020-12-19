import { Selection } from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import ExchangeAction from '../ExchangeAction';
import Skill from '../Skill';

class Drunk extends Skill<void> {
	protected priority = 0x1800;

	protected mode = SkillMode.Write;

	isFeasible(data: Selection): boolean {
		if (!data.cards) {
			return false;
		}

		const card = this.driver.getCenterCard(data.cards[0]);
		return !!card;
	}

	protected run(data: Selection): void {
		if (!data.cards) {
			return;
		}

		const card = this.driver.getCenterCard(data.cards[0]);
		if (!card) {
			return;
		}

		this.driver.addAction(new ExchangeAction(this, this.owner, card));
	}
}

export default Drunk;
