import { Role } from '@bezier/werewolf-core';

import Action from '../game/Action';
import Driver from '../game/Driver';
import Card from '../game/Card';
import Player from '../game/Player';

export default class TransformAction extends Action<Driver> {
	protected target: Player | Card;

	protected newRole: Role;

	/**
	 * Create a transform action
	 * @param {Player} owner
	 * @param {number} priority
	 * @param {Player|CenterCard} target
	 * @param {Role} newRole
	 */
	constructor(owner: Player, priority: number, target: Player | Card, newRole: Role) {
		super(owner, priority);

		this.target = target;
		this.newRole = newRole;
	}

	/**
	 * Take effect
	 */
	exec(): void {
		this.target.setRole(this.newRole);
	}
}
