import { Role } from '@bezier/werewolf-core';

import Event from '../game/Event';
import PassiveSkill from '../game/PassiveSkill';
import Vision from '../game/Vision';
import Driver from '../game/Driver';
import Player from '../game/Player';

export default class VisionSkill extends PassiveSkill<Driver, Vision> {
	protected viewerRole: Role;

	/**
	 * role should be seen by viewer
	 * @param {Role} myRole
	 * @param {Role} viewerRole
	 */
	constructor(myRole: Role, viewerRole: Role) {
		super(Event.Visioning, myRole);
		this.viewerRole = viewerRole;
	}

	takeEffect(driver: Driver, self: Player, data: Vision): boolean {
		if (data.viewer.getRole() === this.viewerRole) {
			data.players.push(self);
		}
		return false;
	}
}
