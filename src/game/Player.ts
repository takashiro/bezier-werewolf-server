import { EventEmitter } from 'events';

import {
	Role,
	Player as PlayerProfile,
} from '@bezier/werewolf-core';

import Skill from './Skill';

interface Player {
	on(event: 'seated', listener: () => void): this;
	on(event: 'ready', listener: () => void): this;
	once(event: 'seated', listener: () => void): this;
	once(event: 'ready', listener: () => void): this;
	off(event: 'seated', listener: () => void): this;
	off(event: 'ready', listener: () => void): this;
}

class Player extends EventEmitter {
	protected seat: number;

	protected seatKey?: string;

	protected role: Role;

	protected ready: boolean;

	protected lynchTarget?: Player;

	protected skills: Skill<Player, unknown, unknown, unknown>[];

	constructor(seat: number) {
		super();
		this.seat = seat;
		this.role = Role.Unknown;
		this.ready = false;
		this.skills = [];
	}

	/**
	 * @return seat
	 */
	getSeat(): number {
		return this.seat;
	}

	/**
	 * @return seat key
	 */
	getSeatKey(): string | undefined {
		return this.seatKey;
	}

	/**
	 * Set seat key
	 * @param seatKey
	 */
	setSeatKey(seatKey: string): void {
		this.seatKey = seatKey;
		this.emit('seated');
	}

	isSeated(): boolean {
		return Boolean(this.seatKey);
	}

	/**
	 * @return role
	 */
	getRole(): Role {
		return this.role;
	}

	/**
	 * Set role
	 * @param role
	 */
	setRole(role: Role): void {
		this.role = role;
	}

	isReady(): boolean {
		return this.ready;
	}

	setReady(ready: boolean): void {
		if (this.ready === ready) {
			return;
		}
		this.ready = ready;
		this.emit('ready');
	}

	/**
	 * Set lynch target
	 * @param target
	 */
	setLynchTarget(target: Player): void {
		this.lynchTarget = target;
	}

	/**
	 * @return lynch target
	 */
	getLynchTarget(): Player | undefined {
		return this.lynchTarget;
	}

	/**
	 * Sets player skill
	 * @param skill
	 */
	addSkill(skill: Skill<Player, unknown, unknown, unknown>): void {
		this.skills.push(skill);
	}

	/**
	 * @return player skills
	 */
	getSkills(): Skill<Player, unknown, unknown, unknown>[] {
		return this.skills;
	}

	getProfile(): PlayerProfile {
		return {
			seat: this.seat,
			role: this.role,
		};
	}
}

export default Player;
