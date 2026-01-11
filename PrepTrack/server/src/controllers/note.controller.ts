import { Request, Response } from 'express';
import Note from '../models/Note';

// @desc    Get user notes
// @route   GET /api/notes
// @access  Public (needs userId in query)
export const getNotes = async (req: Request, res: Response) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'User ID required' });

        const notes = await Note.find({ userId }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Public
export const createNote = async (req: Request, res: Response) => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
