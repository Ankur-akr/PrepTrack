import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get user profile/stats
// @route   GET /api/users/:id
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json({
                name: user.name,
                email: user.email,
                streak: user.streak,
                solvedCount: user.solvedQuestions.length,
                solvedQuestions: user.solvedQuestions
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Solve a question (Update Streak)
// @route   POST /api/users/solve
export const solveQuestion = async (req: Request, res: Response) => {
    const { userId, questionId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if already solved
        if (user.solvedQuestions.some(q => q.toString() === questionId)) {
            return res.json({ message: 'Already solved', user });
        }

        // Streak Logic
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let last = user.lastSolvedDate ? new Date(user.lastSolvedDate) : null;
        if (last) last.setHours(0, 0, 0, 0);

        if (last) {
            const diffTime = Math.abs(today.getTime() - last.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                user.streak = (user.streak || 0) + 1;
            } else if (diffDays > 1) {
                user.streak = 1;
            }
            // If diffDays === 0 (same day), do nothing to streak
        } else {
            user.streak = 1;
        }

        user.lastSolvedDate = new Date();
        user.solvedQuestions.push(questionId);
        await user.save();

        res.json(user);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
