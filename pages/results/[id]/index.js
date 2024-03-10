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
    const [resultDataOther, setResultDataOther] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { data: session, status } = useSession()
    const [otherUserId, setOtherUserId] = useState('');

    const fetchResults = async (otherId) => {
        try {
            console.log("data")
            if (!id || status == 'loading') return
            const res = await fetch(`/api/results?examId=${id}&userId=${otherId ? otherUserId : session?.user?._id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch results');
            }
            const data = await res.json();
            console.log(data)
            if (otherId)
                setResultDataOther(data);
            else
                setResultData(data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch results');
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log(id)

        if (id && session?.user) {
            fetchResults();
        }
    }, [id, status]);

    const handleCompare = async () => {
        fetchResults(true)
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

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
            <div className='my-4'>
                <label className='form-label' htmlFor='otherUserId'>Enter other User ID:</label>
                <input className='form-control' style={{width: '300px'}} type='text' id='otherUserId' value={otherUserId} onChange={(e) => setOtherUserId(e.target.value)} />
                <button className='btn btn-primary my-2 me-2' onClick={handleCompare}>Compare</button>
            </div>
            {resultDataOther && <>
                <h3>Friend Results</h3>
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
                        {resultDataOther && Object.entries(resultDataOther.subjectScores).map(([subject, scores]) => (
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
                    <strong>Total Positive Marks:</strong> {resultDataOther && resultDataOther.totalPositiveMarks}<br />
                    <strong>Total Negative Marks:</strong> {resultDataOther && resultDataOther.totalNegativeMarks}<br />
                    <strong>Overall Total Score:</strong> {resultDataOther && resultDataOther.overallTotalScore}
                </div></>}
            <Link href={router.asPath + '/analysis'} className='btn btn-primary my-4'>Show Analysis</Link>
        </div>
    );
};

export default ResultsPage;
