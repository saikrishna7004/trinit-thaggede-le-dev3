// pages/api/analysis.js

import Exam from '../../models/exam';
import Answer from '../../models/answer';
import connectToMongo from '../../utils/connectMongo';

export default async function handler(req, res) {
    await connectToMongo();

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId, examId } = req.query;

    try {
        const exam = await Exam.findById(examId).populate('questions');
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const answerData = await Answer.find({ userId, quizId: examId });

        // Prepare data with questions and answers grouped by subject
        const answersBySubject = {};
        exam.questions.forEach(question => {
            const answer = answerData.find(answer => answer.questionId.toString() === question._id.toString());
            console.log(answer)

            if (!answersBySubject[question.subject]) {
                answersBySubject[question.subject] = [];
            }

            // console.log(answer.answer != '-1')
            // console.log((answer && answer.answer != '-1') ? (answer.answer == question.answer ? question.positiveMarks : question.negativeMarks) : 0)

            answersBySubject[question.subject].push({
                question: question.text,
                options: question.options,
                correctAnswer: question.answer,
                markedAnswer: (answer && answer.answer != '-1') ? answer.answer : 'Not answered',
                timetaken: answer ? answer.timetaken : 'Not answered',
                marks: (answer && answer.answer != '-1') ? (answer.answer == question.answer ? question.positiveMarks : question.negativeMarks) : 0
            });
        });

        res.status(200).json({ answersBySubject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
