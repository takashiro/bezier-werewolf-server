import { Role } from '@bezier/werewolf-core';
import Skill from './Skill';

class Player {
	protected seat: number;

	protected seatKey?: string;

	protected role: Role;

	protected lynchTarget?: Player;

	protected skill?: Skill;

	constructor(seat: number) {
		this.seat = seat;
		this.role = Role.Unknown;
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
	setSkill(skill: Skill): void {
		this.skill = skill;
	}

	/**
	 * @return player skill
	 */
	getSkill(): Skill | undefined {
		return this.skill;
	}
}

export default Player;
