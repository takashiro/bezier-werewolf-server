import { Role } from '@bezier/werewolf-core';
import insert from '../util/insert';
import ActionDriver from './ActionDriver';

import Collection from './Collection';
import BaseSkill from './Skill';
import MutexType from './MutexType';

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

			if (skill.isSequential()) {
				this.addPhase(skill.getOrder());
			}
		}
	}

	releaseSkills(from = Number.NEGATIVE_INFINITY): void {
		const { skills } = this;

		const readBlocked = new Set<MutexType>();
		for (const cur of skills) {
			if (cur.getOrder() < from) {
				continue;
			}

			const readMode = cur.getReadMode();
			const writeMode = cur.getWriteMode();
			if (readBlocked.size <= 0 || !readMode.some((mutex) => readBlocked.has(mutex))) {
				cur.setReady(true);

				// Skills that read anything should always be blocked now, since a skill is released.
				readBlocked.add(MutexType.Any);
			}

			if (writeMode.includes(MutexType.Any)) {
				// Do not release any following skills since the skill blocks anything.
				break;
			}

			// Prevent reading what the skill is writing.
			for (const mode of writeMode) {
				readBlocked.add(mode);
			}
		}
	}
}
