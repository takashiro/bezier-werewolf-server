import {
	Role,
	PlayerProfile,
} from '@bezier/werewolf-core';

import Action from './Action';
import Card from './Card';
import Event from './Event';
import PassiveSkill from './PassiveSkill';
import Player from './Player';
import ProactiveSkill from './ProactiveSkill';
import Vision from './Vision';

import shuffle from '../util/shuffle';

const enum State {
	Invalid, // To avoid unexpected equation
	Starting, // Users are taking seats
	Running, // Players are voting for somebody to get lynched
	Stopping, // Ready to execute skill effects
	Ended, // The game is over
}

export default class Driver {
	protected roles: Role[];

	protected centerCards: Card[];

	protected players: Player[];

	protected proactiveSkills: Map<Role, ProactiveSkill<Driver, unknown, unknown>[]>;

	protected passiveSkills: Map<Event, PassiveSkill<Driver, unknown>[]>;

	protected actions: Action<Driver>[];

	protected finished: boolean;

	constructor() {
		this.roles = [];
		this.centerCards = [];
		this.players = [];
		this.proactiveSkills = new Map();
		this.passiveSkills = new Map();
		this.actions = [];
		this.finished = false;
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
	 * Get player
	 * @param seat
	 */
	getPlayer(seat: number): Player | undefined {
		return this.players[seat - 1];
	}

	/**
	 * Get a center card
	 * @param index
	 */
	getCenterCard(index: number): Card | undefined {
		return this.centerCards[index];
	}

	register<InputType>(skill: PassiveSkill<Driver, InputType>): void {
		const event = skill.getEvent();
		const skills = this.passiveSkills.get(event);
		if (!skills) {
			this.passiveSkills.set(event, [skill]);
		} else {
			skills.push(skill);
		}
	}

	/**
	 * Trigger skills on a player
	 * @param event
	 * @param target
	 * @param data
	 */
	trigger<InputType>(event: Event, target: Player, data: InputType): void {
		const skills = this.passiveSkills.get(event);
		if (!skills) {
			return;
		}

		for (const skill of skills) {
			if (!skill.isTriggerable(this, target)) {
				continue;
			}

			const broken = skill.takeEffect(this, target, data);
			if (broken) {
				break;
			}
		}
	}

	/**
	 * Show the vision of a player
	 * @param viewer
	 * @return players that can be seen
	 */
	showVision(viewer: Player): PlayerProfile[] {
		const vision: Vision = {
			viewer,
			players: [],
		};
		for (const target of this.players) {
			this.trigger(Event.Visioning, target, vision);
		}
		return vision.players.map((player) => player.getProfile());
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
		for (const player of this.players) {
			if (!player.getSeatKey()) {
				return State.Starting;
			}
		}

		for (const player of this.players) {
			if (!player.getLynchTarget()) {
				return State.Running;
			}
		}

		return this.finished ? State.Ended : State.Stopping;
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
		this.players = new Array(playerNum);
		for (let i = 0; i < playerNum; i++) {
			const player = new Player(i + 1);
			player.setRole(roles[3 + i]);
			this.players[i] = player;
		}
	}

	/**
	 * Take all action effects.
	 */
	exec(): void {
		if (this.finished) {
			return;
		}
		this.finished = true;

		this.actions.sort((a, b) => a.getPriority() - b.getPriority());
		for (const action of this.actions) {
			action.exec(this);
		}
	}
}
