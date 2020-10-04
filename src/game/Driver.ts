import { Role, GameConfig } from '@bezier/werewolf-core';

import Action from './Action';
import Card from './Card';
import State from './DriverState';
import Event from './Event';
import PassiveSkill from './PassiveSkill';
import Player from './Player';

import BaseDriver from '../base/Driver';
import shuffle from '../util/shuffle';

export default class Driver implements BaseDriver {
	protected roles: Role[];

	protected centerCards: Card[];

	protected players: Player[];

	protected passiveSkills: Map<Event, PassiveSkill<Player, Driver, unknown>[]>;

	protected actions: Action<Driver>[];

	protected state: State;

	constructor() {
		this.roles = [];
		this.centerCards = [];
		this.players = [];
		this.passiveSkills = new Map();
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

	register<InputType>(skill: PassiveSkill<Player, Driver, InputType>): void {
		const event = skill.getEvent();
		const skills = this.passiveSkills.get(event);
		if (!skills) {
			this.passiveSkills.set(event, [skill]);
		} else {
			skills.push(skill);
		}
		skill.setDriver(this);
	}

	/**
	 * Trigger skills on a player
	 * @param event
	 * @param target
	 * @param data
	 */
	trigger<InputType>(event: Event, data: InputType): void {
		const skills = this.passiveSkills.get(event);
		if (!skills) {
			return;
		}

		for (const skill of skills) {
			if (!skill.isTriggerable(data)) {
				continue;
			}

			const broken = skill.takeEffect(data);
			if (broken) {
				break;
			}
		}
	}

	/**
	 * Add an action
	 * @param action
	 */
	addAction(action: Action<Driver>): void {
		this.actions.push(action);
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
		}
	}

	/**
	 * Take all action effects.
	 */
	exec(): void {
		this.actions.sort((a, b) => a.getPriority() - b.getPriority());
		for (const action of this.actions) {
			action.exec(this);
		}

		this.state = State.Voting;
	}
}
