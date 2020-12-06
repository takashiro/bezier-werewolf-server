import { Role } from '@bezier/werewolf-core';

import Card from '../../../game/Card';
import Driver from '../../../game/Driver';
import Event from '../../../game/Event';
import EventHook from '../../../game/EventHook';

interface AlphaWolf {
	setCard(card: Card): void;
}

export default class CenterWerewolfCard extends EventHook<Driver> {
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
