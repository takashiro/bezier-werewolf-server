import { Role } from '@bezier/werewolf-core';

import Collection from './Collection';
import EventDriver from './EventDriver';
import BaseSkill from './Skill';
import SkillMode from './SkillMode';

type Skill = BaseSkill<unknown, unknown, unknown, unknown>;

function releaseSkills(skills: Skill[], from = 0): number {
	if (from >= skills.length) {
		return Number.NEGATIVE_INFINITY;
	}

	let readBlocked = false;
	let current = Number.NEGATIVE_INFINITY;
	for (let i = from; i < skills.length; i++) {
		const cur = skills[i];
		if (!readBlocked || !cur.hasMode(SkillMode.Read)) {
			cur.setReady(true);
		}
		if (cur.hasMode(SkillMode.Write)) {
			readBlocked = true;
			current = i;
		}
	}

	return current;
}

export default class SkillDriver extends EventDriver {
	protected roles: Role[] = [];

	protected collection = new Collection('room');

	protected phase = Number.NEGATIVE_INFINITY;

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
	 * @return The largest index of ready skills.
	 */
	getPhase(): number {
		return this.phase;
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
	 * Change the current phase.
	 * @param phase The largest index of ready skills.
	 */
	protected movePhaseTo(phase: number): void {
		this.phase = phase;
	}

	/**
	 * Watch the events of skills and make corresponding changes on each event.
	 * @param skills
	 */
	protected registerSkills(skills: Skill[]): void {
		if (skills.length <= 0) {
			return;
		}

		for (let i = 0; i < skills.length; i++) {
			const skill = skills[i];
			skill.setOrder(i);
			skill.once('finished', () => {
				const phase = releaseSkills(skills, i + 1);
				this.movePhaseTo(phase);
			});
		}

		const phase = releaseSkills(skills);
		this.movePhaseTo(phase);
	}
}
