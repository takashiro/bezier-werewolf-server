import { Role } from '@bezier/werewolf-core';

import Card from '../../../game/Card';
import Driver from '../../../game/Driver';
import Event from '../../../game/Event';
import EventHook from '../../../game/EventHook';

interface AlphaWolf {
	getCard(): Card | undefined;
	getDriver(): Driver;
}

export default class CenterWerewolfCard extends EventHook<Driver> {
	protected readonly skill: AlphaWolf;

	constructor(skill: AlphaWolf) {
		super(Event.Preparing);
		this.skill = skill;
	}

	process(): void {
		const { skill } = this;
		if (skill.getCard()) {
			return;
		}

		const driver = skill.getDriver();
		const card = driver.addCenterCard(Role.Werewolf);
		card.addFlag(Role.AlphaWolf);
	}
}
