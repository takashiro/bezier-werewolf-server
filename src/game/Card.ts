import {
	Role,
	Card as CardProfile,
} from '@bezier/werewolf-core';

export default class Card {
	protected pos: number;

	protected role: Role;

	protected revealed = false;

	protected flags?: Role[];

	/**
	 * Center Card
	 * @param pos
	 * @param role
	 */
	constructor(pos: number, role: Role) {
		this.pos = pos;
		this.role = role;
	}

	/**
	 * @return The position of the card.
	 */
	getPos(): number {
		return this.pos;
	}

	/**
	 * Set role
	 * @param role
	 */
	setRole(role: Role): void {
		this.role = role;
	}

	/**
	 * @return role
	 */
	getRole(): Role {
		return this.role;
	}

	/**
	 * @return Whether the actual role is visible to all players.
	 */
	isRevealed(): boolean {
		return this.revealed;
	}

	/**
	 * Sets whether the actual role is flipped (visible to all players).
	 * @param revealed
	 */
	setRevealed(revealed: boolean): void {
		this.revealed = revealed;
	}

	getProfile(): CardProfile {
		return {
			pos: this.pos,
			role: this.role,
		};
	}

	/**
	 * Add a flag to record the card.
	 * @param flag
	 */
	addFlag(flag: Role): void {
		if (!this.flags) {
			this.flags = [flag];
		} else {
			this.flags.push(flag);
		}
	}

	/**
	 * Check whether the card has a specific flag.
	 * @param flag
	 */
	hasFlag(flag: Role): boolean {
		return this.flags ? this.flags.includes(flag) : false;
	}
}
