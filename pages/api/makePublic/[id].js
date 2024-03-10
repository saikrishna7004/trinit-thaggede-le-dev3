import connectMongo from '../../../utils/connectMongo';
import Exam from '../../../models/exam';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { id } = req.query;

    try {
        await connectMongo();

        const exam = await Exam.findById(id);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        exam.status = 'public';
        await exam.save();

        res.status(200).json({ message: 'Exam made public successfully', exam });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
