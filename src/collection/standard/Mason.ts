import {
	Role,
	PlayerProfile,
} from '@bezier/werewolf-core';

import Driver from '../../game/Driver';
import ProactiveSkill from '../../game/ProactiveSkill';

export default class Mason extends ProactiveSkill<Driver, void, PlayerProfile[]> {
	constructor() {
		super(Role.Mason);
	}

	takeEffect(driver: Driver): PlayerProfile[] {
		const players = driver.getPlayers();
		const masons = players.filter((player) => player.getRole() === this.role);
		return masons.map((mason) => mason.getProfile());
	}
}
