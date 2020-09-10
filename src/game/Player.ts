import {
	Role,
	Player as PlayerProfile,
} from '@bezier/werewolf-core';

import Skill from './Skill';

class Player {
	protected seat: number;

	protected seatKey?: string;

	protected role: Role;

	protected ready: boolean;

	protected lynchTarget?: Player;

	protected skill?: Skill<Player, unknown>;

	constructor(seat: number) {
		this.seat = seat;
		this.role = Role.Unknown;
		this.ready = false;
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
		this.ready = ready;
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
	setSkill(skill: Skill<Player, unknown>): void {
		this.skill = skill;
	}

	/**
	 * @return player skill
	 */
	getSkill(): Skill<Player, unknown> | undefined {
		return this.skill;
	}

	getProfile(): PlayerProfile {
		return {
			seat: this.seat,
			role: this.role,
		};
	}
}

export default Player;
