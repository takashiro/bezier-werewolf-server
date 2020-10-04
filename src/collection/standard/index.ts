import { Role } from '@bezier/werewolf-core';

import Collection from '../../game/Collection';

import Mason from './Mason';
import Seer from './Seer';
import Werewolf from './Werewolf';

const col = new Collection('standard');
col.add(Role.Mason, Mason);
col.add(Role.Seer, Seer);
col.add(Role.Werewolf, Werewolf);

export default col;