import { Role } from '@bezier/werewolf-core';

import Player from '../../game/Player';

import CompanionSkill from '../CompanionSkill';
import isWerewolf from '../isWerewolf';

export default class Werewolf extends CompanionSkill {
	protected priority = 300;

	protected role = Role.Werewolf;

	protected isCompanion(player: Player): boolean {
		if (player === this.owner) {
			return false;
		}

		return isWerewolf(player.getNotionalRole());
	}
}
