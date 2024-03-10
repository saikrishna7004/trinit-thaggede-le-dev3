import { Schema, model, models } from 'mongoose';

const questionSchema = new Schema({
    // quizId: {
    //     type: String,
    //     required: true,
    // },
    subject: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    answer: {
        type: Number,
        required: true
    },
    positiveMarks: {
        type: Number,
        default: 4
    },
    negativeMarks: {
        type: Number,
        default: -1
    }
}, {
    timestamps: true
});

const Question = models.Question || model('Question', questionSchema);

export default Question;
