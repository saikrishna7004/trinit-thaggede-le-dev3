import connectMongo from '../../../utils/connectMongo';
import Exam from '../../../models/exam';
import Question from '../../../models/question';

await connectMongo();

export default async function handler(req, res) {
    try {
        const { examid } = req.query;

        const exam = await Exam.findById(examid).populate('questions');

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        const groupedQuestions = exam.questions.reduce((acc, question) => {
            const subjectName = question.subject;
            if (!acc[subjectName]) {
                acc[subjectName] = [];
            }
            acc[subjectName].push({
                id: question._id,
                text: question.text,
                options: question.options,
            });
            return acc;
        }, {});

        const formattedQuestions = Object.entries(groupedQuestions).map(([subject, questions]) => ({
            subject,
            questions,
        }));

        res.status(200).json({ exam, questions: formattedQuestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
