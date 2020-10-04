import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection';

import Drunk from './Drunk';
import Mason from './Mason';
import Seer from './Seer';
import Troublemaker from './Troublemaker';
import Werewolf from './Werewolf';

const col = new Collection('standard');
col.add(Role.Drunk, Drunk);
col.add(Role.Mason, Mason);
col.add(Role.Seer, Seer);
col.add(Role.Troublemaker, Troublemaker);
col.add(Role.Werewolf, Werewolf);

export default col;
