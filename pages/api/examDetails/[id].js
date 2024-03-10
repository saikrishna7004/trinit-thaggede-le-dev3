import connectMongo from '../../../utils/connectMongo';
import Exam from '../../../models/exam';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await connectMongo();

        const { id } = req.query;

        const exam = await Exam.findById(id)
                               .populate('user', 'firstName lastName')
                               .select('-questions');

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        res.status(200).json(exam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
