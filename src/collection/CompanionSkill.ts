import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';
import MutexType from '../game/MutexType';

import Player from '../game/Player';
import VisionSkill from './VisionSkill';

export default abstract class CompanionSkill extends VisionSkill {
	protected role = Role.Unknown;

	protected readMode = [MutexType.NotionalRole];

	isFeasible(data: Selection): boolean {
		return this.selectNone(data);
	}

	protected isCompanion(player: Player): boolean {
		return player !== this.owner && player.getNotionalRole() === this.role;
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const companions = players.filter((player) => this.isCompanion(player));
		return this.showThumbsOf(companions);
	}
}
