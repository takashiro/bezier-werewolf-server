import { Role } from '@bezier/werewolf-core';

import Driver from '../../../game/Driver';
import Event from '../../../game/Event';
import EventListener from '../../../game/EventListener';

import AlphaWolf from './AlphaWolf';

export default class CenterWerewolfCard extends EventListener<Driver> {
	protected skill: AlphaWolf;

	constructor(skill: AlphaWolf) {
		super(Event.Preparing);
		this.skill = skill;
	}

	process(driver: Driver): void {
		const card = driver.addCenterCard(Role.Werewolf);
		this.skill.setCard(card);
	}
}
