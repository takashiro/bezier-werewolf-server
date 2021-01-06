import { Role } from '@bezier/werewolf-core';
import insert from '../util/insert';
import ActionDriver from './ActionDriver';

import Collection from './Collection';
import BaseSkill from './Skill';
import SkillMode from './SkillMode';

type Skill = BaseSkill<unknown, unknown, unknown, unknown>;

export default class SkillDriver extends ActionDriver {
	protected roles: Role[] = [];

	protected collection = new Collection('room');

	protected skills: Skill[] = [];

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

	/**
	 * Watch the events of skills and make corresponding changes on each event.
	 * @param skills
	 */
	addSkill(...skills: Skill[]): void {
		if (skills.length <= 0) {
			return;
		}

		for (const skill of skills) {
			insert(this.skills, skill, (a, b) => a.getOrder() - b.getOrder());
			skill.once('finished', () => {
				const next = skill.getOrder() + 1;
				this.releaseSkills(next);
			});

			if (skill.hasMode(SkillMode.Write)) {
				this.addPhase(skill.getOrder());
			}
		}
	}

	releaseSkills(from = Number.NEGATIVE_INFINITY): void {
		const { skills } = this;

		let readBlocked = false;
		for (const cur of skills) {
			if (cur.getOrder() < from) {
				continue;
			}

			if (!readBlocked || !cur.hasMode(SkillMode.Read)) {
				cur.setReady(true);
				if (cur.hasMode(SkillMode.Write)) {
					readBlocked = true;
				}
			}
		}
	}
}
