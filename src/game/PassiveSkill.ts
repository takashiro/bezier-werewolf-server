import { Role } from '@bezier/werewolf-core';

import Event from './Event';
import Skill from './Skill';

export default abstract class PassiveSkill<OwnerType, DriverType, InputType> extends Skill<OwnerType, DriverType> {
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
	 * @param target
	 */
	abstract isTriggerable(data: InputType): boolean;

	/**
	 * Take effect
	 * @param driver
	 * @param target
	 * @param data
	 * @return Whether to break following actions
	 */
	abstract takeEffect(data: InputType): boolean;
}
