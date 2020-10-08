export default abstract class EventListener<ParamType> {
	protected readonly event: number;

	constructor(event: number) {
		this.event = event;
	}

	/**
	 * @return The event that the listener is bound to.
	 */
	getEvent(): number {
		return this.event;
	}

	/**
	 * Process the event.
	 * @param data Event data.
	 */
	abstract process(data: ParamType): void;
}
