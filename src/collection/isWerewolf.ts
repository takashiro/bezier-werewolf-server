import {
	Role,
	Team,
	Teamship,
} from '@bezier/werewolf-core';

const helpers: Role[] = [
	Role.Minion,
	Role.Squire,
];

export default function isWerewolf(role: Role): boolean {
	return Teamship.get(role) === Team.Werewolf && !helpers.includes(role);
}
