import { Role } from '@bezier/werewolf-core';

export default abstract class Skill<OnwerType, DriverType> {
	protected readonly role: Role;

	protected owner?: OnwerType;

	protected driver?: DriverType;

	constructor(role: Role) {
		this.role = role;
	}

	getRole(): Role {
		return this.role;
	}

	setOwner(owner: OnwerType): void {
		this.owner = owner;
	}

	getOwner(): OnwerType | undefined {
		return this.owner;
	}

	setDriver(driver: DriverType): void {
		this.driver = driver;
	}

	getDriver(): DriverType | undefined {
		return this.driver;
	}
}
