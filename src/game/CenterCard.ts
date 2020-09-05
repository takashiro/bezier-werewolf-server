import { Role } from '@bezier/werewolf-core';

export default class CenterCard {
	protected pos: number;

	protected role: Role;

	/**
	 * Center Card
	 * @param pos
	 * @param role
	 */
	constructor(pos: number, role: Role) {
		this.pos = pos;
		this.role = role;
	}

	/**
	 * Set role
	 * @param role
	 */
	setRole(role: Role): void {
		this.role = role;
	}

	/**
	 * @return role
	 */
	getRole(): Role {
		return this.role;
	}
}
