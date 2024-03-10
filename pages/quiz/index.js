import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ExamCard from '../../components/ExamCard';
import Head from 'next/head';

const ExamPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [publicExams, setPublicExams] = useState([]);
    const [privateExams, setPrivateExams] = useState([]);
    const [allExams, setAllExams] = useState([]);
    const [exams, setExams] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        console.log(allExams)
        console.log(publicExams)
        console.log(privateExams)
    }, [allExams])
    

    const fetchExams = async () => {
        try {
            let url = '/api/fetchExams'
            if (session && session?.user) {
                url += `?userId=${session.user._id}`;
            }
            const response = await fetch(url)
            if (response.ok) {
                const examsData = await response.json();
                const publicExamsData = examsData.filter(exam => exam.status == 'public');
                const publicExamsDataUser = examsData.filter(exam => exam.status == 'public' && exam.user._id == session.user._id);
                const privateExamsData = examsData.filter(exam => exam.status == 'private' && exam.user._id == session.user._id);
                setPublicExams(publicExamsDataUser);
                setPrivateExams(privateExamsData);
                setAllExams([...publicExamsData, ...privateExams]);
                setExams([...publicExamsData, ...privateExams]);
            } else {
                throw new Error('Failed to fetch exams');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (status != 'loading') {
            fetchExams();
        }
    }, [session, status]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        switch (tab) {
            case 'public':
                setExams(publicExams);
                break;
            case 'private':
                setExams(privateExams);
                break;
            default:
                setExams(allExams);
                break;
        }
    };

    if (status === 'loading') return <p>Loading...</p>;
    
    if (!session || !session.user) router.push('/login?next=/quiz');

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
                            <button 
                                className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} 
                                onClick={() => handleTabChange('all')}
                            >
                                All
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'public' ? 'active' : ''}`} 
                                onClick={() => handleTabChange('public')}
                            >
                                Public
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'private' ? 'active' : ''}`} 
                                onClick={() => handleTabChange('private')}
                            >
                                Private
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="nav-link" onClick={fetchExams}>
                                Refresh
                            </button>
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
