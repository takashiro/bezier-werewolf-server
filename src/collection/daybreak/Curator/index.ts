import { Selection } from '@bezier/werewolf-core';

import Skill from '../../Skill.js';
import MutexType from '../../../game/MutexType.js';
import SkipAction from '../../SkipAction.js';
import RandomArtifactAction from './RandomArtifactAction.js';

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
