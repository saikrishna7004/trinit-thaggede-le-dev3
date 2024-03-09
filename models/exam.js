import { Schema, model, models } from 'mongoose';

const examSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 180
    },
    maxMarks: {
        type: Number,
        required: true
    },
    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    status: {
        type: String,
        enum: ['private', 'public'],
        default: 'public'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Exam = models.Exam || model('Exam', examSchema);

export default Exam;
