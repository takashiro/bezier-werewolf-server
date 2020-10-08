import EventListener from './EventListener';

export default class EventDriver {
	protected listeners: Map<number, EventListener<unknown>[]>;

	constructor() {
		this.listeners = new Map();
	}

	register(...listeners: EventListener<unknown>[]): void {
		for (const listener of listeners) {
			const list = this.listeners.get(listener.getEvent());
			if (list) {
				list.push(listener);
			} else {
				this.listeners.set(listener.getEvent(), [listener]);
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
