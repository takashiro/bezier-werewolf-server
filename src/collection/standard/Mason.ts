import { Role } from '@bezier/werewolf-core';

import CompanionSkill from '../CompanionSkill.js';

export default class Mason extends CompanionSkill {
	protected priority = 0x400;

	protected role = Role.Mason;
}
