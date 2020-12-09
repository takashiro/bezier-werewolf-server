import {
	Role,
	Card as CardProfile,
} from '@bezier/werewolf-core';

export default class Card {
	protected pos: number;

	protected role: Role;

	protected revealed = false;

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
}
