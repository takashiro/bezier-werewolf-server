import EventHook from './EventHook';

export default class EventDriver {
	protected listeners: Map<number, EventHook<unknown>[]>;

	constructor() {
		this.listeners = new Map();
	}

	register(...listeners: EventHook<unknown>[]): void {
		for (const listener of listeners) {
			const event = listener.getEvent();
			const list = this.listeners.get(event);
			if (list) {
				list.push(listener);
			} else {
				this.listeners.set(event, [listener]);
			}
		}
	}

	trigger<ParamType>(event: number, data: ParamType): void {
		const listeners = this.listeners.get(event);
		if (!listeners) {
			return;
		}

		for (const listener of listeners) {
			listener.process(data);
		}
	}
}
