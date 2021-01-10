import { EventEmitter } from 'events';

import {
	Role,
	Player as PlayerProfile,
} from '@bezier/werewolf-core';

import BaseSkill from './Skill';

interface Player {
	on(event: 'seated', listener: () => void): this;
	on(event: 'ready', listener: () => void): this;
	once(event: 'seated', listener: () => void): this;
	once(event: 'ready', listener: () => void): this;
	off(event: 'seated', listener: () => void): this;
	off(event: 'ready', listener: () => void): this;
}

export type Skill = BaseSkill<unknown, Player, unknown, unknown>;

class Player extends EventEmitter {
	protected seat: number;

	protected seatKey?: string;

	protected initialRole: Role;

	protected notionalRole?: Role;

	protected actualRole?: Role;

	protected lynchTarget?: Player;

	protected skills: Skill[] = [];

	protected ready = false;

	protected revealed = false;

	protected disclosedTo: Set<number> = new Set();

	constructor(seat: number, role: Role) {
		super();
		this.seat = seat;
		this.initialRole = role;
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
	 * @return The initial role of the player.
	 */
	getInitialRole(): Role {
		return this.initialRole;
	}

	/**
	 * @return The notional role of the player himself.
	 * For example, Mason may be already turned into a werewolf (the actual role) by Alpha Wolf,
	 * but he still meets the other Mason because he think he is Mason (the notional role).
	 */
	getNotionalRole(): Role {
		return this.notionalRole || this.initialRole;
	}

	/**
	 * Change the notional role of the player.
	 * @param role
	 */
	setNotionalRole(role: Role): void {
		this.notionalRole = role;
	}

	/**
	 * @return The actual role of the player.
	 */
	getActualRole(): Role {
		return this.actualRole || this.initialRole;
	}

	/**
	 * Change the actual role of the player.
	 * @param role
	 */
	setActualRole(role: Role): void {
		this.actualRole = role;
	}

	/**
	 * @return The actual role of the player.
	 */
	getRole(): Role {
		return this.actualRole || this.initialRole;
	}

	/**
	 * Change the actual role of the player.
	 * @param role
	 */
	setRole(role: Role): void {
		this.actualRole = role;
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
	addSkill(skill: Skill): void {
		this.skills.push(skill);
	}

	/**
	 * @return player skills
	 */
	getSkills(): Skill[] {
		return this.skills;
	}

	/**
	 * Alias to getActualProfile().
	 */
	getProfile(): PlayerProfile {
		return this.getActualProfile();
	}

	/**
	 * @return Player information including notional role.
	 */
	getNotionalProfile(): PlayerProfile {
		return {
			seat: this.getSeat(),
			role: this.getNotionalRole(),
		};
	}

	/**
	 * @return Player information including actual role.
	 */
	getActualProfile(): PlayerProfile {
		return {
			seat: this.getSeat(),
			role: this.getActualRole(),
		};
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

	/**
	 * @param player
	 * @return Whether the player role is visible to another player.
	 */
	isDisclosedTo(player: Player): boolean {
		return this.disclosedTo.has(player.getSeat());
	}

	/**
	 * Make the role visible to another player at day phase.
	 * @param player
	 */
	discloseTo(player: Player): void {
		this.disclosedTo.add(player.getSeat());
	}
}

export default Player;
