import { Role } from '@bezier/werewolf-core';

import Player from '../../game/Player.js';

import CompanionSkill from '../CompanionSkill.js';
import isWerewolf from '../isWerewolf.js';

export default class Werewolf extends CompanionSkill {
	protected priority = 0x300;

	protected role = Role.Werewolf;

	protected isCompanion(player: Player): boolean {
		if (player === this.owner) {
			return false;
		}

		return isWerewolf(player.getNotionalRole());
	}
}
