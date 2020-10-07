import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection';
import Werewolf from '../standard/Werewolf';

import MysticWolf from './MysticWolf';

const col = new Collection('daybreak');
col.add(Role.MysticWolf, Werewolf, MysticWolf);

export default col;
