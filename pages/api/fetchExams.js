import connectMongo from '../../utils/connectMongo';
import Exam from '../../models/exam';
import { Schema } from 'mongoose';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        await connectMongo();

        const userId = req.query.userId;
        console.log(userId)

        const exams = await Exam.find({})
        .populate('user', 'firstName lastName').select('-questions').lean();

        // console.log(exams)

        res.status(200).json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
