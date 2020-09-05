import { Role } from '@bezier/werewolf-core';

export default abstract class Skill {
	protected role: Role;

	constructor(role: Role) {
		this.role = role;
	}
}
