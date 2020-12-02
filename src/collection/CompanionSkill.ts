import { Role, Vision } from '@bezier/werewolf-core';

import Player from '../game/Player';
import VisionSkill from './VisionSkill';

export default abstract class CompanionSkill extends VisionSkill {
	protected role = Role.Unknown;

	protected isCompanion(player: Player): boolean {
		return player !== this.owner && player.getRolle() === this.role;
	}

	protected show(): Vision {
		const players = this.driver.getPlayers();
		const masons = players.filter((player) => this.isCompanion(player));
		return CompanionSkill.showPlayers(masons);
	}
}
