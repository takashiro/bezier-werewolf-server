import { Router } from 'express';
import { lobby } from '../base/Lobby.js';

const router = Router();

router.get('/', (req, res) => {
	const status = lobby.getStatus();
	res.json(status);
});

export default router;
