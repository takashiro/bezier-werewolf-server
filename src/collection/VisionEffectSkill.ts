import { Role } from '@bezier/werewolf-core';

import Event from '../game/Event';
import PassiveSkill from '../game/PassiveSkill';
import Driver from '../game/Driver';
import Player from '../game/Player';

import Vision from './Vision';

export default abstract class VisionEffect extends PassiveSkill<Player, Driver, Vision> {
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

	isTriggerable(data: Vision): boolean {
		return data.viewer.getRole() === this.viewerRole;
	}

	abstract takeEffect(data: Vision): boolean;
}
