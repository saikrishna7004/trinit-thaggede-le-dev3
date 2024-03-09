import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ResultsPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { data: session, status } = useSession()

    useEffect(() => {
        const fetchResults = async () => {
            try {
                console.log("data")
                if(!id || status=='loading') return
                const res = await fetch(`/api/results?examId=${id}&userId=${session?.user?._id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch results');
                }
                const data = await res.json();
                console.log(data)
                setResultData(data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch results');
                setLoading(false);
            }
        };

        console.log(id)

        if (id && session?.user) {
            fetchResults();
        }
    }, [id, status]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    console.log(router)

    return (
        <div className='container my-4'>
            <h1>Exam Results</h1>
            <Link className='btn btn-outline-primary rounded-0 mt-4' href={`/results`}><FontAwesomeIcon icon={faArrowLeft} /> Go Back</Link>
            <table className='table table-striped my-4'>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Positive Score</th>
                        <th>Negative Score</th>
                        <th>Total Score</th>
                    </tr>
                </thead>
                <tbody>
                    {resultData && Object.entries(resultData.subjectScores).map(([subject, scores]) => (
                        <tr key={subject}>
                            <td>{subject}</td>
                            <td>{scores.positiveScore}</td>
                            <td>{scores.negativeScore}</td>
                            <td>{scores.totalScore}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div>
                <strong>Total Positive Marks:</strong> {resultData && resultData.totalPositiveMarks}<br />
                <strong>Total Negative Marks:</strong> {resultData && resultData.totalNegativeMarks}<br />
                <strong>Overall Total Score:</strong> {resultData && resultData.overallTotalScore}
            </div>
            <Link href={router.asPath + '/analysis'} className='btn btn-primary my-4'>Show Analysis</Link>
        </div>
    );
};

export default ResultsPage;