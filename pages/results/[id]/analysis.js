import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Chart from 'chart.js/auto';
import { useSession } from 'next-auth/react';
import DoughnutChartComponent from '../../../components/DoughnutChartComponent ';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const UserExamDetailsPage = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const { id } = router.query;
    const [examData, setExamData] = useState({});
    const [marksData, setMarksData] = useState({});
    const [timeTakenData, setTimeTakenData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.user || !id) return;

            try {
                const response = await fetch(`/api/analysis?userId=${session.user._id}&examId=${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                setExamData(data);

                // Calculate marks and time taken data
                const marksData = {};
                const timeTakenData = {};
                Object.entries(data.answersBySubject).forEach(([subject, answers]) => {
                    const totalMarks = answers.reduce((acc, answer) => {
                        return acc + answer.marks;
                    }, 0);
                    const totalTimeTaken = answers.reduce((acc, answer) => {
                        return acc + parseFloat(answer.timetaken);
                    }, 0);
                    marksData[subject] = totalMarks;
                    timeTakenData[subject] = totalTimeTaken;
                });
                console.log(marksData)
                setMarksData(marksData);
                setTimeTakenData(timeTakenData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [session, id]);

    useEffect(() => {
        if (Object.keys(examData).length === 0) return;

        const ctx = document.getElementById('examChart');
        const datasets = Object.entries(examData?.answersBySubject || {}).map(([subject, answers]) => ({
            label: subject,
            data: answers.map(answer => answer.timetaken),
            fill: false,
            borderColor: getRandomColor(),
            tension: 0.1
        }));

        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: datasets[0]?.data.map((_, index) => `Question ${index + 1}`) || [],
                datasets
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Time Taken per Question',
                        color: 'black'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Question Number',
                            color: 'black'
                        },
                        ticks: {
                            color: 'black'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Time Taken (seconds)',
                            color: 'black'
                        },
                        ticks: {
                            color: 'black'
                        }
                    }
                }
            }
        });
    }, [examData]);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const getAnswerStatus = (correctAnswer, markedAnswer) => {
        if (markedAnswer === 'Not answered') {
            return 'Not answered';
        } else if (Number.parseInt(correctAnswer) === Number.parseInt(markedAnswer)) {
            return 'Correct';
        } else {
            return 'Wrong';
        }
    };

    const getAnswerStatusColor = (correctAnswer, markedAnswer) => {
        const answerStatus = getAnswerStatus(correctAnswer, markedAnswer);
        switch (answerStatus) {
            case 'Correct':
                return 'green';
            case 'Wrong':
                return 'red';
            case 'Not answered':
                return 'blue';
            default:
                return 'black';
        }
    };

    return (
        <div className='container my-4'>
            <h1>User Exam Details</h1>
            <Link className='btn btn-outline-primary rounded-0 mt-4' href={`/results/${id}`}><FontAwesomeIcon icon={faArrowLeft} /> Go Back</Link>
            <DoughnutChartComponent marksData={marksData} timeTakenData={timeTakenData} />
            <h2 className='my-3'>Time Spent Analysis</h2>
            <canvas id="examChart" style={{ width: '600px !important' }}></canvas>
            <div className="questions">
                <h2 className='my-3'>Question Answers</h2>
                {Object.entries(examData?.answersBySubject || {}).map(([subject, answers]) => (
                    <div key={subject}>
                        <h3 className='my-3 px-2'>{subject}</h3>
                        {answers.map((answer, index) => (
                            <div className='question' key={index}>
                                <p><b>Quesion {index + 1}: </b>{answer.question}</p>
                                <p><b>Options:</b></p>
                                <ol className='mb-3' type='1'>
                                    {answer.options.map((option, index) => (
                                        <li style={{ listStyle: 'revert' }} key={index}>{option}</li>
                                    ))}
                                </ol>
                                <p><b>Correct Answer: </b>{Number.parseInt(answer.correctAnswer) + 1}</p>
                                <p><b>Marked Answer: </b>{Number.parseInt(answer.markedAnswer) + 1}</p>
                                <p><b>Answer Status: </b>
                                    <b style={{ color: getAnswerStatusColor(answer.correctAnswer, answer.markedAnswer) }}>
                                        {getAnswerStatus(answer.correctAnswer, answer.markedAnswer)}
                                    </b>
                                </p>
                                <p><b>Time Taken: </b>{answer.timetaken} seconds</p>
                                <p><b>Marks: </b>{answer.marks}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserExamDetailsPage;
