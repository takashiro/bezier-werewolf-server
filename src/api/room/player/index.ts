import { Router } from 'express';

import seatRouter from './seat';
import skillRouter from './skill';
import boardRouter from './board';
import lynchRouter from './lynch';

const router = Router({
	mergeParams: true,
});

router.use('/seat', seatRouter);
router.use('/skill', skillRouter);
router.use('/board', boardRouter);
router.use('/lynch', lynchRouter);

export default router;
