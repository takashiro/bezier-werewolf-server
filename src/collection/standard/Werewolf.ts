import {
	Role,
	Team,
	Teamship,
} from '@bezier/werewolf-core';

import Player from '../../game/Player';

import CompanionSkill from '../CompanionSkill';

export default class Werewolf extends CompanionSkill {
	protected priority = 300;

	protected role = Role.Werewolf;

	protected isCompanion(player: Player): boolean {
		if (player === this.owner) {
			return false;
		}

		const role = player.getRole();
		return role !== Role.Minion && Teamship.get(role) === Team.Werewolf;
	}
}
