import { Role } from '@bezier/werewolf-core';

import Action from '../game/Action.js';
import ActionType from '../game/ActionType.js';
import Card from '../game/Card.js';
import Player, { Skill } from '../game/Player.js';

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
		super(owner, ActionType.TransformRole);

		this.target = target;
		this.newRole = newRole;
	}

	protected run(): void {
		this.target.setRole(this.newRole);
	}
}
