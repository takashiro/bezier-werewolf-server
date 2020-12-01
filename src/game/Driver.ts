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
	protected centerCards: Card[] = [];

	protected players: Player[] = [];

	protected state = State.Preparing;

	getConfig(): GameConfig {
		return {
			roles: this.roles,
		};
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

		this.sortSkills();

		this.trigger(Event.Preparing, this);
	}

	protected prepareRoles(): void {
		const roles = [...this.roles];
		shuffle(roles);

		this.centerCards = new Array(3);
		for (let i = 0; i < 3; i++) {
			this.centerCards[i] = new Card(i, roles[i]);
		}

		const playerNum = roles.length - this.centerCards.length;
		const players: Player[] = new Array(playerNum);
		for (let i = 0; i < playerNum; i++) {
			const player = new Player(i + 1);
			player.setRole(roles[3 + i]);
			players[i] = player;
		}
		this.players = players;
	}

	protected giftPlayer(player: Player): void {
		const SkillCreators = this.collection.find(player.getRole());
		if (!SkillCreators) {
			return;
		}

		for (const SkillCreator of SkillCreators) {
			const skill = new SkillCreator(this, player);
			player.addSkill(skill);

			const listeners = skill.getHooks();
			if (listeners) {
				this.register(...listeners);
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
				this.releaseSkills();
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
