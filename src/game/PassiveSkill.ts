import { Role } from '@bezier/werewolf-core';

import Event from './Event';
import Skill from './Skill';
import Player from './Player';

export default abstract class PassiveSkill<DriverType, InputType> extends Skill {
	protected readonly event: Event;

	/**
	 * Create a skill
	 * @param {Timing} event
	 * @param {Role} role
	 */
	constructor(event: Event, role: Role) {
		super(role);
		this.event = event;
	}

	getEvent(): Event {
		return this.event;
	}

	/**
	 * Check if this skill can be triggered
	 * @param driver
	 * @param target
	 */
	isTriggerable(driver: DriverType, target: Player): boolean {
		return driver && target && target.getRole() === this.role;
	}

	/**
	 * Take effect
	 * @param driver
	 * @param target
	 * @param data
	 * @return Whether to break following actions
	 */
	abstract takeEffect(driver: DriverType, target: Player, data: InputType): boolean;
}
