import connectMongo from '../../../utils/connectMongo';
import User from '../../../models/user'

async function connect() {
    await connectMongo();
    console.log('Attempted a connection');
}

connect();

export default async function handler(req, res) {
    try {
        console.log(req.body)
        const user = await User.create({
            ...req.body
        })
        return res.status(200).json({ ...user._doc })
    } catch (error) {
        console.log(error)
        if (error.keyValue && error.keyValue.username) {
            return res.status(200).json({ error: "Username "+req.body.username+" already exists" })
        }
        if (error.keyValue && error.keyValue.email) {
            return res.status(200).json({ error: "Email "+req.body.email+" already exists" })
        }
        return res.status(400).json({ error })
    }
}
