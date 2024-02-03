import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill.js';
import isWerewolf from '../isWerewolf.js';
import MutexType from '../../game/MutexType.js';

export default class Squire extends VisionSkill {
	protected priority = 0x930;

	protected readMode = [MutexType.NotionalRole, MutexType.ActualRole];

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const werewolves = players.filter((player) => isWerewolf(player.getNotionalRole()));
		return this.showPlayers(werewolves);
	}
}
