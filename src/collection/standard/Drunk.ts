import { Selection } from '@bezier/werewolf-core';

import SkillMode from '../../game/SkillMode';
import ExchangeAction from '../ExchangeAction';
import Skill from '../Skill';

class Drunk extends Skill<void> {
	protected priority = 0x1800;

	protected mode = SkillMode.Write;

	isFeasible(data: Selection): boolean {
		return Boolean(this.selectCard(data));
	}

	protected run(data: Selection): void {
		const card = this.selectCard(data);
		if (card) {
			this.driver.addAction(new ExchangeAction(this, this.owner, card));
		}
	}
}

export default Drunk;
