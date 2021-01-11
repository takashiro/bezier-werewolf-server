import { Selection } from '@bezier/werewolf-core';

import Skill from '../Skill';
import SkillMode from '../../game/SkillMode';
import ShieldAction from '../ShieldAction';
import SkipAction from '../SkipAction';

export default class Sentinel extends Skill<void> {
	protected mode = SkillMode.Lock;

	protected priority = 0x000;

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		return !target || target !== this.owner;
	}

	protected run(data: Selection): void {
		const target = this.selectPlayer(data);
		if (target) {
			this.driver.addAction(new ShieldAction(this, target));
		} else {
			this.driver.addAction(new SkipAction(this));
		}
	}
}
