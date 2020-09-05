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
}

export default Player;
