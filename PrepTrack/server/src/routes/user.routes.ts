import express from 'express';
import { getUserProfile, solveQuestion } from '../controllers/user.controller';

const router = express.Router();

router.get('/:id', getUserProfile);
router.post('/solve', solveQuestion);

export default router;
