import { Router } from 'express';

import seatRouter from './seat';
import skillRouter from './skill';
import lynchRouter from './lynch';

const router = Router({
	mergeParams: true,
});

router.use('/seat', seatRouter);
router.use('/skill', skillRouter);
router.use('/lynch', lynchRouter);

export default router;
