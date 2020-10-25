import { Role } from '@bezier/werewolf-core';

import Collection from './Collection';
import EventDriver from './EventDriver';
import BaseSkill from './Skill';
import SkillMode from './SkillMode';

type Skill = BaseSkill<unknown, unknown, unknown, unknown>;

function releaseSkills(skills: Skill[], from = 0): void {
	if (from >= skills.length) {
		return;
	}

	let readBlocked = false;
	for (let i = from; i < skills.length; i++) {
		const cur = skills[i];
		if (!readBlocked || !cur.hasMode(SkillMode.Read)) {
			cur.setReady(true);
		}
		if (cur.hasMode(SkillMode.Write)) {
			readBlocked = true;
		}
	}
}

export default class SkillDriver extends EventDriver {
	protected roles: Role[];

	protected collection: Collection;

	constructor() {
		super();
		this.roles = [];
		this.collection = new Collection('room');
	}

	/**
	 * Set roles
	 * @param roles
	 */
	setRoles(roles: Role[]): void {
		this.roles = roles;
	}

	/**
	 * @return roles
	 */
	getRoles(): Role[] {
		return this.roles;
	}

	/**
	 * Load extension packs.
	 * @param collections Extension packs of One Night Ultimate Werewolf
	 */
	loadCollection(...collections: Collection[]): void {
		for (const col of collections) {
			for (const role of col.getRoles()) {
				if (!this.roles.includes(role)) {
					continue;
				}

				const creators = col.find(role);
				if (creators) {
					this.collection.add(role, ...creators);
				}
			}
		}
	}

	protected static linkSkills(skills: Skill[]): void {
		for (let i = 0; i < skills.length; i++) {
			const skill = skills[i];
			skill.once('finished', () => {
				releaseSkills(skills, i + 1);
			});
		}

		releaseSkills(skills);
	}
}
