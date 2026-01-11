import { Request, Response } from 'express';
import Question from '../models/Question';

// @desc    Get all questions
// @route   GET /api/questions
// @access  Public
export const getQuestions = async (req: Request, res: Response) => {
    try {
        const questions = await Question.find({});
        res.json(questions);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a question
// @route   POST /api/questions
// @access  Public (for now)
export const createQuestion = async (req: Request, res: Response) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json(question);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a question
// @route   PUT /api/questions/:id
// @access  Public (for now)
export const updateQuestion = async (req: Request, res: Response) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a question
// @route   DELETE /api/questions/:id
// @access  Public (for now)
export const deleteQuestion = async (req: Request, res: Response) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
