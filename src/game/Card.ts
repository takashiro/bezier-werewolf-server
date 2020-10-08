import {
	Role,
	Card as CardData,
} from '@bezier/werewolf-core';

export default class Card {
	protected pos: number;

	protected role: Role;

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

	toJSON(): CardData {
		return {
			pos: this.pos,
			role: this.role,
		};
	}
}
