import express from 'express';
import {
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} from '../controllers/question.controller';

const router = express.Router();

router.get('/', getQuestions);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;
