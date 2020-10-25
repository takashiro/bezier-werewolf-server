import {
	Role,
	GameConfig,
} from '@bezier/werewolf-core';

import Action from './Action';
import Card from './Card';
import Collection from './Collection';
import State from './DriverState';
import EventDriver from './EventDriver';
import Player from './Player';

import Event from './Event';
import BaseDriver from '../base/Driver';
import shuffle from '../util/shuffle';

export default class Driver extends EventDriver implements BaseDriver {
	protected roles: Role[];

	protected centerCards: Card[];

	protected players: Player[];

	protected collection: Collection;

	protected actions: Action[];

	protected state: State;

	constructor() {
		super();
		this.roles = [];
		this.centerCards = [];
		this.players = [];
		this.collection = new Collection('room');
		this.actions = [];
		this.state = State.Preparing;
	}

	getConfig(): GameConfig {
		return {
			roles: this.roles,
		};
	}

	/**
	 * Set roles
	 * @param roles
	 */
	setRoles(roles: Role[]): void {
		this.roles = roles;
	}

	/**
	 * @return roles
	 */
	getRoles(): Role[] {
		return this.roles;
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
	 * Add an action
	 * @param action
	 */
	addAction(action: Action): void {
		this.actions.push(action);
	}

	/**
	 * @return driver state
	 */
	getState(): State {
		return this.state;
	}

	/**
	 * Load extension packs.
	 * @param collections Extension packs of One Night Ultimate Werewolf
	 */
	loadCollection(...collections: Collection[]): void {
		for (const col of collections) {
			for (const role of col.getRoles()) {
				if (!this.roles.includes(role)) {
					continue;
				}

				const creators = col.find(role);
				if (creators) {
					this.collection.add(role, ...creators);
				}
			}
		}
	}

	/**
	 * Arrange roles
	 */
	prepare(): void {
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

		this.state = State.TakingSeats;

		for (const player of this.players) {
			player.once('seated', () => {
				if (this.state === State.TakingSeats && players.every((p) => p.isSeated())) {
					this.state = State.InvokingSkills;
				}
			});

			player.once('ready', () => {
				if (this.state === State.InvokingSkills && players.every((p) => p.isReady())) {
					this.exec();
				}
			});

			const SkillCreators = this.collection.find(player.getRole());
			if (!SkillCreators) {
				continue;
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

		this.trigger(Event.Preparing, this);
	}

	/**
	 * Take all action effects.
	 */
	exec(): void {
		this.actions.sort((a, b) => a.getPriority() - b.getPriority());
		for (const action of this.actions) {
			action.exec();
		}

		this.state = State.Voting;
	}
}
