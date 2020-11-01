import { Role } from '@bezier/werewolf-core';

import Action from '../game/Action';
import Card from '../game/Card';
import Player, { Skill } from '../game/Player';

export default class TransformAction extends Action {
	protected target: Player | Card;

	protected newRole: Role;

	/**
	 * Create a transform action
	 * @param owner
	 * @param target
	 * @param newRole
	 */
	constructor(owner: Skill, target: Player | Card, newRole: Role) {
		super(owner);

		this.target = target;
		this.newRole = newRole;
	}

	protected run(): void {
		this.target.setRole(this.newRole);
	}
}
