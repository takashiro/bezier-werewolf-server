import { Selection } from '@bezier/werewolf-core';

import Skill from '../../Skill';
import MutexType from '../../../game/MutexType';
import ShieldAction from '../../ShieldAction';
import ShieldEffect from './ShieldEffect';
import SkipAction from '../../SkipAction';

export default class Sentinel extends Skill<void> {
	protected priority = 0x000;

	protected writeMode = [MutexType.Any];

	protected hooks = [
		new ShieldEffect(),
	];

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
