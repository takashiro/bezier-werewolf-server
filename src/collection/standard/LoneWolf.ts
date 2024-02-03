import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill.js';
import isWerewolf from '../isWerewolf.js';
import MutexType from '../../game/MutexType.js';

export default class LoneWolf extends VisionSkill {
	protected priority = 0x301;

	protected readMode = [MutexType.ActualRole];

	isFinished(): boolean {
		if (super.isFinished() || !this.driver.isLoneWolf()) {
			return true;
		}

		const players = this.driver.getPlayers();
		const wolves = players.filter((player) => isWerewolf(player.getNotionalRole()));
		return wolves.length > 1;
	}

	isFeasible(data: Selection): boolean {
		return Boolean(this.selectCard(data));
	}

	protected show(data: Selection): Vision | undefined {
		const card = this.selectCard(data);
		if (card) {
			return this.showCard(card);
		}
	}
}
