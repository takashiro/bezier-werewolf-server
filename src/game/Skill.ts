export default abstract class Skill<OwnerType, DriverType> {
	protected owner?: OwnerType;

	protected driver?: DriverType;

	setOwner(owner: OwnerType): void {
		this.owner = owner;
	}

	getOwner(): OwnerType | undefined {
		return this.owner;
	}

	setDriver(driver: DriverType): void {
		this.driver = driver;
	}

	getDriver(): DriverType | undefined {
		return this.driver;
	}
}
