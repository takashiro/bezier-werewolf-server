import { PlayerProfile } from '@bezier/werewolf-core';

import Driver from '../game/Driver';
import Event from '../game/Event';
import ProactiveSkill from '../game/ProactiveSkill';
import Player from '../game/Player';
import Vision from '../game/Vision';

export default abstract class VisionSkill extends ProactiveSkill<Player, Driver, Selection, PlayerProfile[]> {
	/**
	 * Show the vision of a player
	 * @param viewer
	 * @return players that can be seen
	 */
	protected showVision(viewer: Player): PlayerProfile[] {
		if (!this.driver) {
			return [];
		}

		const vision: Vision = {
			viewer,
			players: [],
		};
		this.driver.trigger(Event.Visioning, vision);
		return vision.players.map((player) => player.getProfile());
	}
}
