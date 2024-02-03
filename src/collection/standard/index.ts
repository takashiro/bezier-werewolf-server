import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection.js';

import Doppelganger from './Doppelganger.js';
import Drunk from './Drunk.js';
import Insomniac from './Insomniac.js';
import Mason from './Mason.js';
import Minion from './Minion.js';
import Robber from './Robber.js';
import Seer from './Seer.js';
import Troublemaker from './Troublemaker.js';
import Werewolf from './Werewolf.js';
import LoneWolf from './LoneWolf.js';

const col = new Collection('standard');
col.add(Role.Doppelganger, Doppelganger);
col.add(Role.Drunk, Drunk);
col.add(Role.Insomniac, Insomniac);
col.add(Role.Mason, Mason);
col.add(Role.Minion, Minion);
col.add(Role.Robber, Robber);
col.add(Role.Seer, Seer);
col.add(Role.Troublemaker, Troublemaker);
col.add(Role.Werewolf, Werewolf, LoneWolf);

export default col;
