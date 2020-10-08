import { Selection } from '@bezier/werewolf-core';

import Driver from '../game/Driver';
import Player from '../game/Player';
import BaseSkill from '../game/Skill';

abstract class Skill<OutputType> extends BaseSkill<Player, Driver, Selection, OutputType> {
}

export default Skill;