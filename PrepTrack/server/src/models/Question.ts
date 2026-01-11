import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    link: { type: String },
    tags: [{ type: String }],
    status: { type: String, enum: ['Solved', 'Pending'], default: 'Pending' }
}, { timestamps: true });

const Question = mongoose.model('Question', questionSchema);
export default Question;
