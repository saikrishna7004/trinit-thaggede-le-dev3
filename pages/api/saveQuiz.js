// pages/api/saveQuiz.js

import connectMongo from '../../utils/connectMongo';
import Exam from '../../models/exam';
import Question from '../../models/question';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await connectMongo();

        const { title, duration, maxMarks, subjects, user } = req.body;

        const questionIds = [];

        for (const subject of subjects) {
            for (const questionData of subject.questions) {
                const question = new Question({
                    ...questionData,
                    subject: subject.name
                });

                await question.save();

                questionIds.push(question._id);
            }
        }

        const exam = new Exam({
            title,
            duration,
            maxMarks,
            questions: questionIds,
            user
        });

        await exam.save();

        res.status(201).json({ message: 'Exam saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
