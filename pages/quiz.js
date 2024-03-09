import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ExamCard from '../components/ExamCard';
import Head from 'next/head';

const ExamPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [exams, setExams] = useState([]);

    const fetchExams = async () => {
        try {
            let url = '/api/fetchExams';
            if (session && session.user) {
                console.log(session.user)
                url += `?userId=${session.user._id}`;
            }
            const response = await fetch(url);
            if (response.ok) {
                const examsData = await response.json();
                console.log(examsData)
                setExams(examsData);
            } else {
                throw new Error('Failed to fetch exams');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if(status != 'loading') fetchExams();
    }, [session]);

    if (status == 'loading') return <p>Loading...</p>;

    return (
        <div>
            <Head>
                <title>Attempt Quiz</title>
            </Head>
            <div className="container my-3">
                <h1>Select an exam to attempt</h1>
            </div>

            <div className="container border p-0">
                <div className="card-header">
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="true" href="#">Active</a>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" href="#" onClick={fetchExams}>Refresh</button>
                        </li>
                    </ul>
                </div>

                <div className="container p-3">
                    <div className="container p-0">
                        <div className="container border">
                            <h6 className="sorting m-0 p-1">Exam</h6>
                        </div>
                        <div className="container p-2 border" style={{ backgroundColor: '#fff' }}>
                            {exams.map(exam => (
                                <ExamCard key={exam._id} exam={{ ...exam, startTime: 'Anytime', endTime: 'Anytime' }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamPage;
