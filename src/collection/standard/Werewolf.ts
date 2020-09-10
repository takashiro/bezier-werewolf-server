import {
	Role,
	Team,
	Teamship,
} from '@bezier/werewolf-core';

import Player from '../../game/Player';

import CompanionSkill from '../CompanionSkill';

export default class Werewolf extends CompanionSkill {
	constructor() {
		super(Role.Werewolf);
	}

	protected isCompanion(player: Player): boolean {
		const role = player.getRole();
		return role === this.role || Teamship.get(role) === Team.Werewolf;
	}
}
