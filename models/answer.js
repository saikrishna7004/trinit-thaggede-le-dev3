import { Schema, model, models } from 'mongoose';

const AnswerSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    quizId: {
        type: String,
        required: true,
    },
    questionId: {
        type: String,
        required: true,
        unique: true
    },
    answer: {
        type: String,
        required: true,
    },
    timetaken: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Answer = models.Answer || model('Answer', AnswerSchema);

export default Answer;