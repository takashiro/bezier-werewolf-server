import {
	Role,
	Selection,
	Vision,
} from '@bezier/werewolf-core';

import Player from '../game/Player';
import VisionSkill from './VisionSkill';

export default abstract class CompanionSkill extends VisionSkill {
	protected role = Role.Unknown;

	isFeasible(data: Selection): boolean {
		return this.driver && !data.cards && !data.players;
	}

	protected isCompanion(player: Player): boolean {
		return player !== this.owner && player.getNotionalRole() === this.role;
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const companions = players.filter((player) => this.isCompanion(player));
		return CompanionSkill.showPlayers(companions, false);
	}
}
