import { Role, Vision } from '@bezier/werewolf-core';

import VisionSkill from './VisionSkill';
import Player from '../game/Player';

export default abstract class CompanionSkill extends VisionSkill {
	protected role: Role;

	constructor(role: Role) {
		super();
		this.role = role;
	}

	protected isCompanion(player: Player): boolean {
		return player !== this.owner && player.getRole() === this.role;
	}

	takeEffect(): Vision {
		if (!this.driver) {
			return {};
		}
		const players = this.driver.getPlayers();
		const masons = players.filter((player) => this.isCompanion(player));
		return CompanionSkill.showPlayers(masons);
	}
}
