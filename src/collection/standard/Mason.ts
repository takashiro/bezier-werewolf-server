import { Role } from '@bezier/werewolf-core';

import CompanionSkill from '../CompanionSkill';

export default class Mason extends CompanionSkill {
	protected priority = 400;

	protected role = Role.Mason;
}
