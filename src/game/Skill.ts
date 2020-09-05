import { Role } from '@bezier/werewolf-core';

export default abstract class Skill {
	protected readonly role: Role;

	constructor(role: Role) {
		this.role = role;
	}

	getRole(): Role {
		return this.role;
	}
}
