import {
	Role,
	GameConfig,
} from '@bezier/werewolf-core';

import BaseDriver from '../base/Driver';
import shuffle from '../util/shuffle';

import Card from './Card';
import State from './DriverState';
import Event from './Event';
import Player, { Skill } from './Player';
import SkillDriver from './SkillDriver';

export default class Driver extends SkillDriver implements BaseDriver {
	protected random = true;

	protected loneWolf = false;

	protected centerCards: Card[] = [];

	protected players: Player[] = [];

	protected state = State.Preparing;

	getConfig(): GameConfig {
		return {
			cardNum: this.centerCards.length,
			roles: this.roles,
			random: this.random,
			loneWolf: this.loneWolf,
		};
	}

	isRandom(): boolean {
		return this.random;
	}

	setRandom(random: boolean): void {
		this.random = random;
	}

	isLoneWolf(): boolean {
		return this.loneWolf;
	}

	setLoneWolf(enabled: boolean): void {
		this.loneWolf = enabled;
	}

	/**
	 * @return All players. It is empty until the driver is prepared.
	 */
	getPlayers(): Player[] {
		return this.players;
	}

	/**
	 * Get player
	 * @param seat
	 */
	getPlayer(seat: number): Player | undefined {
		return this.players[seat - 1];
	}

	/**
	 * @param a
	 * @param b
	 * @return The distance between two players.
	 */
	getDistance(a: Player, b: Player): number {
		const p = a.getSeat();
		const q = b.getSeat();
		const dist1 = Math.abs(p - q);
		const dist2 = this.players.length - dist1;
		return Math.min(dist1, dist2);
	}

	/**
	 * @return Center cards used in the game.
	 */
	getCenterCards(): Card[] {
		return this.centerCards;
	}

	/**
	 * Get a center card
	 * @param index
	 */
	getCenterCard(index: number): Card | undefined {
		return this.centerCards[index];
	}

	/**
	 * Add a center card.
	 * @param card
	 */
	addCenterCard(role: Role): Card {
		const index = this.centerCards.length;
		const card = new Card(index, role);
		this.centerCards.push(card);
		return card;
	}

	/**
	 * @return driver state
	 */
	getState(): State {
		return this.state;
	}

	/**
	 * Arrange roles
	 */
	prepare(): void {
		this.prepareRoles();

		this.state = State.TakingSeats;
		for (const player of this.players) {
			this.giftPlayer(player);
			this.watchPlayer(player);
		}
		this.runDanglingHooks();
		this.releaseSkills();

		this.trigger(Event.Preparing, null);
	}

	/**
	 * Shuffle all the roles and return them.
	 * @return Shuffled roles
	 */
	shuffleRoles(): Role[] {
		const roles = [...this.roles];
		if (this.isRandom()) {
			shuffle(roles);
		}
		return roles;
	}

	protected prepareRoles(): void {
		const roles = this.shuffleRoles();

		this.centerCards = new Array(3);
		for (let i = 0; i < 3; i++) {
			this.centerCards[i] = new Card(i, roles[i]);
		}

		const playerNum = roles.length - this.centerCards.length;
		const players: Player[] = new Array(playerNum);
		for (let i = 0; i < playerNum; i++) {
			const role = roles[3 + i];
			const player = new Player(i + 1, role);
			players[i] = player;
		}
		this.players = players;
	}

	/**
	 * Find all the skills by player role and attach the skills to the player.
	 * @param player The player to be gifted.
	 * @param role If not specified, player's initial role will be used.
	 */
	giftPlayer(player: Player, role?: Role): void {
		const SkillCreators = this.collection.find(role || player.getInitialRole());
		if (!SkillCreators) {
			return;
		}

		const skills: Skill[] = [];
		for (const SkillCreator of SkillCreators) {
			const skill = new SkillCreator(this, player);
			if (skill.isFinished()) {
				continue;
			}

			skills.push(skill);
			player.addSkill(skill);

			const hooks = skill.getHooks();
			if (hooks) {
				this.register(...hooks);
			}
		}

		this.addSkill(...skills);
	}

	protected watchPlayer(player: Player): void {
		player.once('seated', () => {
			if (this.state !== State.TakingSeats) {
				return;
			}

			if (!this.players.every((p) => p.isSeated())) {
				return;
			}

			this.state = State.InvokingSkills;
		});

		player.once('ready', () => {
			if (this.state !== State.InvokingSkills) {
				return;
			}

			if (!this.players.every((p) => p.isReady())) {
				return;
			}

			if (this.isPending()) {
				return;
			}

			this.state = State.Voting;
		});

		player.once('voted', () => {
			if (this.state !== State.Voting) {
				return;
			}

			if (!this.players.every((p) => p.hasVoted())) {
				return;
			}

			this.state = State.Completed;
		});
	}

	protected runDanglingHooks(): void {
		const dummy = new Player(0, Role.Unknown);
		for (const card of this.centerCards) {
			const SkillCreators = this.collection.find(card.getRole());
			if (!SkillCreators) {
				continue;
			}

			for (const SkillCreator of SkillCreators) {
				const skill = new SkillCreator(this, dummy);
				const hooks = skill.getHooks();
				if (hooks) {
					this.register(...hooks);
				}
			}
		}
	}

	addSkill(...skills: Skill[]): void {
		for (const skill of skills) {
			const priority = skill.getPriority();
			const seat = skill.getOwner().getSeat();
			const order = priority * 100 + seat;
			skill.setOrder(order);
		}

		super.addSkill(...skills);
	}
}
