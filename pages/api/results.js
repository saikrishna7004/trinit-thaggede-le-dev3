// pages/api/results/[examId].js

import connectMongo from '../../utils/connectMongo';
import Answer from '../../models/Answer';
import Exam from '../../models/Exam';
import Question from '../../models/Question';

export default async function handler(req, res) {
    const { method, query: { examId, userId } } = req;

    if (method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await connectMongo();

        const exam = await Exam.findById(examId).populate('questions');
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const answers = await Answer.find({ quizId: examId, userId });

        const subjectScores = {};
        let totalPositiveMarks = 0;
        let totalNegativeMarks = 0;

        exam.questions.forEach(question => {
            const { _id: questionId, subject, positiveMarks, negativeMarks } = question;
            const subjectAnswers = answers.filter(answer => answer.questionId == questionId);

            let subjectPositiveScore = 0;
            let subjectNegativeScore = 0;

            subjectAnswers.forEach(answer => {
                if (answer.answer == question.answer) {
                    subjectPositiveScore += positiveMarks;
                } else {
                    subjectNegativeScore += negativeMarks;
                }
            });

            totalPositiveMarks += subjectPositiveScore;
            totalNegativeMarks += subjectNegativeScore;

            if (!subjectScores[subject]) {
                subjectScores[subject] = {
                    positiveScore: 0,
                    negativeScore: 0,
                    totalScore: 0
                };
            }

            subjectScores[subject].positiveScore += subjectPositiveScore;
            subjectScores[subject].negativeScore += subjectNegativeScore;
            subjectScores[subject].totalScore += subjectPositiveScore + subjectNegativeScore;
        });

        // Calculate overall scores
        const overallTotalScore = totalPositiveMarks + totalNegativeMarks;

        // Combine subject-wise scores with overall scores
        const resultData = {
            subjectScores,
            totalPositiveMarks,
            totalNegativeMarks,
            overallTotalScore
        };

        res.status(200).json(resultData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
