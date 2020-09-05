import { Role } from '@bezier/werewolf-core';

class Player {
	protected seat: number;

	protected seatKey?: string;

	protected role: Role;

	protected lynchTarget?: Player;

	constructor(seat: number) {
		this.seat = seat;
		this.role = Role.Unknown;
	}

	/**
	 * Get seat
	 * @return {number}
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
	 * @param {number} seatKey
	 */
	setSeatKey(seatKey: string): void {
		this.seatKey = seatKey;
	}

	/**
	 * Get role
	 * @return {Role}
	 */
	getRole(): Role {
		return this.role;
	}

	/**
	 * Set role
	 * @param {Role} role
	 */
	setRole(role: Role): void {
		this.role = role;
	}

	/**
	 * Set lynch target
	 * @param {Player} target
	 */
	setLynchTarget(target: Player): void {
		this.lynchTarget = target;
	}

	/**
	 * Get lynch target
	 * @return {Player}
	 */
	getLynchTarget(): Player | undefined {
		return this.lynchTarget;
	}
}

export default Player;
