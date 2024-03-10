import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { faClock, faInfoCircle, faShare, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Swal from 'sweetalert2';

const ExamDetails = () => {
    const router = useRouter();
    const { id } = router.query;
    const [exam, setExam] = useState(null);
    const { data: session, status } = useSession();
    const [questions, setQuestions] = useState([]);

    const fetchQues = ()=>{
        if (id) {
            fetch(`/api/examDetails/${id}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setExam(data)
                })
                .catch(error => console.error('Error fetching exam details:', error));
        }
    }

    useEffect(() => {
        fetchQues()
    }, [id]);

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Check out this exam',
                    text: `Check out this exam: ${exam.title}`,
                    url: `${window.location.origin}/exam/${id}`
                });
            } else {
                throw new Error('Web Share API not supported');
            }
        } catch (error) {
            console.error('Sharing failed:', error);
            try {
                await navigator.clipboard.writeText(`${window.location.origin}/${id}/`);
                alert('Link copied to clipboard!');
            } catch (clipboardError) {
                console.error('Copying to clipboard failed:', clipboardError);
                alert('Sharing failed. Please copy the link manually.');
            }
        }
    };

    const handleStartExam = () => {
        const winName = `MyWindow${id}`;
        const winURL = `/examInstructions/${id}`;
        const windowOptions = 'resizable=yes,status=0,toolbar=0,scrollbars=1';
        window.open(winURL, winName, windowOptions);
    };

    const handleViewResults = () => {
        router.push(`/results/${id}`);
    };

    const handleMakePublic = async () => {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'Once made public, the exam will be accessible to everyone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, make it public',
            cancelButtonText: 'Cancel'
        });
    
        if (confirmed.isConfirmed) {
            try {
                const response = await fetch(`/api/makePublic/${id}`, {
                    method: 'PUT'
                });
    
                if (response.ok) {
                    const updatedExam = await response.json();
                    console.log('Exam status updated to public:', updatedExam);
                    setQuestions([])
                    fetchQues()
                } else {
                    console.error('Failed to update exam status to public:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating exam status:', error);
            }
        }
    };
    
    const handleFetchQuestions = async () => {
        try {
            const response = await fetch(`/api/questions/${id}`);
            const data = await response.json();
            console.log(data.questions)
            setQuestions(data.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            Swal.fire('Error!', 'Failed to fetch questions.', 'error');
        }
    };

    return (
        <div className='container mt-4'>
            <Head>
                <title>Exam Details</title>
            </Head>
            <h1 className='text-center mb-4'>Exam Details</h1>
            {exam ? (
                <div className='row justify-content-center'>
                    <div className='card col-md-6'>
                        <div className='card-body'>
                            <p className='card-text'><b>Exam ID:</b> {id}</p>
                            <p className='card-text'><b>Title:</b> {exam.title}</p>
                            <p className='card-text'><b>Duration:</b> {exam.duration} minutes</p>
                            <p className='card-text'><b>Max Marks:</b> {exam.maxMarks}</p>
                            <p className='card-text'><b>Status:</b> {exam.status}</p>
                            <p className='card-text'><b>User:</b> {exam.user.firstName} {exam.user.lastName}</p>
                            <div className='text-center'>
                                {exam.status == 'public' && (
                                    <button className='btn btn-primary me-2' onClick={handleShare}>
                                        <FontAwesomeIcon icon={faShare} /> Share
                                    </button>
                                )}
                                {exam.status == 'private' && session && session?.user?._id == exam.user._id && (
                                    <>
                                        <button className='btn btn-info mx-1 my-1' onClick={handleMakePublic}>
                                            Make Public
                                        </button>
                                        <button className='btn btn-info mx-1 my-1' onClick={handleFetchQuestions}>
                                            Fetch Questions
                                        </button>
                                    </>
                                )}
                                {((exam.status == 'public') || ((exam.status == 'private') && (session && session?.user?._id == exam.user._id))) && (
                                    <>
                                        <button className='btn btn-success mx-1 my-1' onClick={handleStartExam}><FontAwesomeIcon icon={faClock} /> Start Exam</button>
                                        <button className='btn btn-info mx-1 my-1' onClick={handleViewResults}><FontAwesomeIcon icon={faInfoCircle} /> View Results</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {questions.length > 0 && (
                        <div className="questions">
                        <h2 className='my-3'>Questions</h2>
                        {questions.map((subject, i) => (
                            <div key={i}>
                                <h3 className='my-3 px-2'>{subject.subject}</h3>
                                {subject.questions.map((q, index) => (
                                    <div className='question' key={index}>
                                        <p><b>Quesion {index + 1}: </b>{q.text}</p>
                                        <p><b>Options:</b></p>
                                        <ol className='mb-3' type='1'>
                                            {q.options.map((option, index) => (
                                                <li style={{ listStyle: 'revert' }} key={index}>{option}</li>
                                            ))}
                                        </ol>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    
                    )}
                </div>
            ) : (
                <p className='text-center'>Loading...</p>
            )}
        </div>
    );
};

export default ExamDetails;
