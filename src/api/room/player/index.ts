import { Router } from 'express';

import seatRouter from './seat.js';
import skillRouter from './skill.js';
import boardRouter from './board.js';
import lynchRouter from './lynch.js';

const router = Router({
	mergeParams: true,
});

router.use('/seat', seatRouter);
router.use('/skill', skillRouter);
router.use('/board', boardRouter);
router.use('/lynch', lynchRouter);

export default router;
