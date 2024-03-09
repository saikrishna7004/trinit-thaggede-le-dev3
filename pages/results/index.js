// pages/exam-page.js

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ExamCard from '../../components/ExamCard';
import Head from 'next/head';

const ExamPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [exams, setExams] = useState([]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await fetch('/api/fetchExams');
                if (response.ok) {
                    const examsData = await response.json();
                    setExams(examsData);
                } else {
                    throw new Error('Failed to fetch exams');
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchExams();
    }, []);

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
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">Disabled</a>
                        </li>
                    </ul>
                </div>

                {/* Display Exam Cards */}
                <div className="container p-3">
                    <div className="container p-0">
                        <div className="container border">
                            <h6 className="sorting m-0 p-1">Exam</h6>
                        </div>
                        <div className="container p-2 border" style={{ backgroundColor: '#fff' }}>
                            {exams.map(exam => (
                                <ExamCard key={exam._id} exam={{ ...exam, startTime: 'Anytime', endTime: 'Anytime' }} results={true} />
                            ))}
                        </div>
                    </div>
                </div>
                {/* End Display Exam Cards */}
            </div>
        </div>
    );
};

export default ExamPage;
