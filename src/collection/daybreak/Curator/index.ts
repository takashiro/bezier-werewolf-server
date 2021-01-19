import { Selection } from '@bezier/werewolf-core';

import Skill from '../../Skill';
import MutexType from '../../../game/MutexType';
import SkipAction from '../../SkipAction';
import RandomArtifactAction from './RandomArtifactAction';

export default class Curator extends Skill<void> {
	protected priority = 0xb00;

	protected writeMode = [MutexType.Any];

	isFeasible(data: Selection): boolean {
		const player = this.selectPlayer(data);
		return Boolean(player && player.getArtifactNum() <= 0);
	}

	protected run(data: Selection): void {
		const player = this.selectPlayer(data);
		if (!player) {
			this.driver.addAction(new SkipAction(this));
		} else {
			this.driver.addAction(new RandomArtifactAction(this, player));
		}
	}
}
