import {
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import VisionSkill from '../VisionSkill';
import isWerewolf from '../isWerewolf';
import MutexType from '../../game/MutexType';

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
