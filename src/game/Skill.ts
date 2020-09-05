import { Role } from '@bezier/werewolf-core';

export default class Skill {
	protected role: Role;

	constructor(role: Role) {
		this.role = role;
	}
}
