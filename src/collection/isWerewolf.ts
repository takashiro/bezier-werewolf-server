import {
	Role,
	Team,
	Teamship,
} from '@bezier/werewolf-core';

export default function isWerewolf(role: Role): boolean {
	return Teamship.get(role) === Team.Werewolf && role !== Role.Minion;
}
