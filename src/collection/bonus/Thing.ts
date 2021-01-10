import { Selection } from '@bezier/werewolf-core';
import Skill from '../Skill';

export default class Thing extends Skill<void> {
	protected priority = 0x1410;

	isFeasible(data: Selection): boolean {
		const target = this.selectPlayer(data);
		if (!target) {
			return false;
		}
		return this.driver.getDistance(target, this.owner) === 1;
	}

	protected run(data: Selection): void {
		const target = this.selectPlayer(data);
		if (target) {
			this.owner.discloseTo(target);
		}
	}
}
