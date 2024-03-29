import { Role } from '@bezier/werewolf-core';

import Driver from './Driver.js';
import Player from './Player.js';
import Skill from './Skill.js';

type SkillCreator = new(driver: Driver, owner: Player) => Skill<Driver, Player, unknown, unknown>;

export default class Collection {
	protected name: string;

	protected skillMap: Map<Role, SkillCreator[]>;

	constructor(name: string) {
		this.name = name;
		this.skillMap = new Map();
	}

	getName(): string {
		return this.name;
	}

	getRoles(): IterableIterator<Role> {
		return this.skillMap.keys();
	}

	find(role: Role): SkillCreator[] | undefined {
		return this.skillMap.get(role);
	}

	add(role: Role, ...skills: SkillCreator[]): void {
		this.skillMap.set(role, skills);
	}
}
