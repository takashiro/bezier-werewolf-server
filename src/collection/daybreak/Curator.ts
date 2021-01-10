import {
	Artifact,
	Selection,
} from '@bezier/werewolf-core';

import Skill from '../Skill';
import SkillMode from '../../game/SkillMode';

const artifacts: Artifact[] = [
	Artifact.VoidOfNothingness,
	Artifact.ShroudOfShame,
	Artifact.MaskOfMuting,
	Artifact.ClawOfTheWerewolf,
	Artifact.BrandOfTheVillager,
	Artifact.CudgelOfTheTanner,
	Artifact.BowOfTheHunter,
	Artifact.SwordOfTheBodyguard,
	Artifact.CloakOfThePrince,
];

export default class Curator extends Skill<void> {
	protected priority = 0xb00;

	isFeasible(data: Selection): boolean {
		const player = this.selectPlayer(data);
		return Boolean(player && player.getArtifactNum() <= 0);
	}
	protected run(data: Selection): void {
		const player = this.selectPlayer(data);
		if (!player) {
			return;
		}

		const artifact = artifacts[Math.floor(Math.random() * artifacts.length)];
		player.addArtifact(artifact);
	}
}
