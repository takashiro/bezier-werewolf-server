import { Role } from '@bezier/werewolf-core';
import Collection from '../../game/Collection.js';

import ApprenticeTanner from './ApprenticeTanner.js';
import AuraSeer from './AuraSeer.js';
import Beholder from './Beholder.js';
import Squire from './Squire.js';
import Thing from './Thing.js';

const col = new Collection('bonus');

col.add(Role.ApprenticeTanner, ApprenticeTanner);
col.add(Role.AuraSeer, AuraSeer);
col.add(Role.Beholder, Beholder);
col.add(Role.Squire, Squire);
col.add(Role.Thing, Thing);

export default col;
