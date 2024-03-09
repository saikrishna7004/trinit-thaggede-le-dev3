import Answer from '../../models/answer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { answers, quizId, userId } = req.body;

    try {
        if (!answers) {
            return res.status(400).json({ message: 'Answers are required' });
        }

        const answerDocs = Object.entries(answers).map(([questionId, answerData]) => {
            const { answer, timetaken } = answerData;

            return {
                userId,
                quizId,
                questionId,
                answer,
                timetaken,
            };
        });

        const savedAnswers = await Answer.insertMany(answerDocs);

        return res.status(201).json({ message: 'Answers submitted successfully', savedAnswers });
    } catch (error) {
        console.error('Error submitting answers:', error);
        return res.status(500).json({ message: 'Failed to submit answers' });
    }
}
