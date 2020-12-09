import {
	Role,
	GameConfig,
} from '@bezier/werewolf-core';

import BaseDriver from '../base/Driver';
import shuffle from '../util/shuffle';

import ActionDriver from './ActionDriver';
import Card from './Card';
import State from './DriverState';
import Event from './Event';
import Player, { Skill } from './Player';

export default class Driver extends ActionDriver implements BaseDriver {
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
		this.sortSkills();

		this.trigger(Event.Preparing, this);
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

		for (const SkillCreator of SkillCreators) {
			const skill = new SkillCreator(this, player);
			if (skill.isFinished()) {
				continue;
			}

			player.addSkill(skill);

			const hooks = skill.getHooks();
			if (hooks) {
				this.register(...hooks);
			}
		}
	}

	protected watchPlayer(player: Player): void {
		player.once('seated', () => {
			if (this.state !== State.TakingSeats) {
				return;
			}

			if (this.players.every((p) => p.isSeated())) {
				this.state = State.InvokingSkills;
			}
		});

		player.once('ready', () => {
			if (this.state !== State.InvokingSkills) {
				return;
			}

			if (this.players.every((p) => p.isReady())) {
				this.state = State.Voting;
			}
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

	protected sortSkills(): void {
		const skills: Skill[] = [];
		for (const player of this.players) {
			skills.push(...player.getSkills());
		}

		skills.sort((a, b) => {
			const factor = a.getPriority() - b.getPriority();
			if (factor !== 0) {
				return factor;
			}
			return a.getOwner().getSeat() - b.getOwner().getSeat();
		});

		this.registerSkills(skills);
	}
}
