import React, { useState, useEffect } from 'react';
import Question from './Question';
import Statistics from './Statistics';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

const MainExam = ({ questions, quizId, exam, timer }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [questionsData, setQuestionsData] = useState([]);
    const [allQuestions, setAllQuestions] = useState([]);
    const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [subjectCount, setSubjectCount] = useState({});
    const [answers, setAnswers] = useState({});
    const [showSidebar, setShowSidebar] = useState(true);
    const [questionStartTime, setQuestionStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [showStatistics, setShowStatistics] = useState(false);
    const { data: session, status } = useSession()

    useEffect(() => {
        console.log(answers);
    }, [answers]);

    useEffect(() => {
        if (questions.length > 0) {
            const dummySubjects = questions.map(item => item.subject);
            setAllQuestions(questions);
            setSubjects(dummySubjects);

            const subjectCountsTemp = {};
            let currentIndex = 0;
            questions.forEach(subject => {
                subjectCountsTemp[subject.subject] = { length: subject.questions.length, firstIndex: currentIndex };
                currentIndex += subject.questions.length;
            });
            setSubjectCount(subjectCountsTemp);

            const defaultAnswers = {};
            questions.forEach(subject => {
                subject.questions.forEach(question => {
                    defaultAnswers[question.id] = { answer: -1, status: 'Not Answered', timetaken: 0 };
                });
            });
            setAnswers(defaultAnswers);

            if (dummySubjects.length > 0) {
                const allQuestions = questions.flatMap(subject => subject.questions);
                setQuestionsData(allQuestions);
            }
        }
    }, [questions]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setElapsedTime(elapsedTime + 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [elapsedTime]);

    useEffect(() => {
        if (currentPage < questionsData.length) {
            setQuestionStartTime(Date.now());
            setElapsedTime(0);
        }
    }, [currentPage, questionsData]);

    const handleSubjectClick = (subjectIndex) => {
        setCurrentSubjectIndex(subjectIndex);
        setCurrentPage(subjectCount[subjects[subjectIndex]].firstIndex);
    };

    const handleNextClick = () => {
        if (currentPage < questionsData.length - 1) {
            setCurrentPage(currentPage + 1);
        } else {
            if (currentSubjectIndex < subjects.length - 1) {
                setCurrentPage(subjectCount[subjects[currentSubjectIndex + 1]].firstIndex);
                setCurrentSubjectIndex(currentSubjectIndex + 1);
            }
        }
    };

    const handleSaveAndNextClick = () => {
        const questionId = questionsData[currentPage].id;
        const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
        const updatedAnswers = {
            ...answers,
            [questionId]: { ...answers[questionId], status: 'Saved', timetaken: answers[questionId].timetaken + timeTaken }
        };
        setAnswers(updatedAnswers);
        handleNextClick();
    };

    const handleMarkForReviewAndNextClick = () => {
        const questionId = questionsData[currentPage].id;
        const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
        const updatedAnswers = {
            ...answers,
            [questionId]: { ...answers[questionId], status: 'Marked For Review', timetaken: answers[questionId].timetaken + timeTaken }
        };
        setAnswers(updatedAnswers);
        handleNextClick();
    };

    const handleOptionSelect = ({ id, optionIndex }) => {
        setAnswers({
            ...answers,
            [id]: { answer: optionIndex, status: 'Attempted', timetaken: answers[id].timetaken }
        });
    };

    const handleQuestionButtonClick = (questionIndex) => {
        const subjectIndex = Object.values(subjectCount).findIndex(subject => questionIndex >= subject.firstIndex && questionIndex < subject.firstIndex + subject.length);
        setCurrentSubjectIndex(subjectIndex);
        setCurrentPage(questionIndex);
    };

    const handleSubmit = async () => {
        try {
            let res = await Swal.fire({
                title: 'Submit Answers?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, submit',
                cancelButtonText: 'No, cancel',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            });

            if (res.isConfirmed) {
                const response = await fetch('/api/submitAnswers', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ answers, userId: session?.user?._id, quizId: quizId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to submit answers');
                }

                Swal.fire({
                    title: 'Answers Submitted!',
                    text: 'Your answers have been submitted successfully.',
                    icon: 'success',
                }).then(() => {
                    window.close();
                });
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: 'Error!',
                text: 'Failed to submit answers. Please try again.',
                icon: 'error',
            });
        }
    };

    const handleClearResponse = () => {
        const questionId = questionsData[currentPage].id;
        const updatedAnswers = {
            ...answers,
            [questionId]: { answer: -1, status: 'Not Answered', timetaken: answers[questionId].timetaken }
        };
        setAnswers(updatedAnswers);
    };

    const getButtonColor = (status) => {
        switch (status) {
            case 'Not Answered':
                return 'btn-danger';
            case 'Saved':
                return 'btn-success';
            case 'Marked For Review':
                return 'btn-primary';
            default:
                return 'btn-secondary';
        }
    };

    return (<>
        <div className='px-3' style={{ background: 'linear-gradient( rgb(45, 111, 182) 0%, rgb(75, 147, 219) 49%, rgb(45, 111, 182) 100%)', color: 'white', fontSize: '30px' }}>{exam && exam.title}</div>
        <div className="container-fluid my-3 alldiv">
            <h2>Time Remaining: {timer}</h2>
            <div className="row">
                <div style={{ border: '1px solid black', width: showSidebar ? '75%' : '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    <div className="subject-buttons my-4">
                        {subjects.map((subject, index) => (
                            <button style={{width: '120px'}} className={`btn ${currentSubjectIndex == index ? 'btn-primary' : 'btn-outline-primary'} rounded-0 me-2`} key={index} onClick={() => handleSubjectClick(index)}>{subject}</button>
                        ))}
                    </div>

                    <div className="question-container">
                        {questionsData.length > 0 && (
                            <Question
                                id={questionsData[currentPage].id}
                                text={questionsData[currentPage].text}
                                options={questionsData[currentPage].options}
                                onOptionSelect={handleOptionSelect}
                                answerStatus={answers[questionsData[currentPage].id]?.status}
                                selected={answers[questionsData[currentPage].id].answer}
                                index={currentPage + 1}
                                elapsedTime={elapsedTime}
                            />
                        )}
                    </div>

                    <div className="navigation-buttons my-3">
                        <button className='btn rounded-0 w-25 me-2' style={{ border: '1px solid' }} onClick={handleMarkForReviewAndNextClick}>Mark For Review & Next</button>
                        <button className='btn rounded-0 w-25' style={{ border: '1px solid' }} onClick={handleClearResponse}>Clear Response</button>
                        <button className='btn btn-primary rounded-0 w-25' style={{ float: 'right' }} onClick={handleSaveAndNextClick}>Save & Next</button>
                        <button className='btn btn-success rounded-0 w-25 my-3' style={{ float: 'right' }} onClick={handleSubmit}>Submit</button>
                    </div>

                    <div className="toggle-button" style={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}>
                        <button className="btn btn-secondary px-1 rounded-0" onClick={() => setShowSidebar(!showSidebar)} style={{ height: '50px' }}>
                            {showSidebar ? '>' : '<'}
                        </button>
                    </div>
                </div>

                {showSidebar && (
                    <div className='px-0' style={{ border: '1px solid black', width: '25%' }}>
                        <div className="question-navigation">
                            {allQuestions.map((subject, subjectIndex) => (
                                <div key={subjectIndex}>
                                    <div className='mb-3 px-3 text-center' style={{ background: 'linear-gradient( rgb(45, 111, 182) 0%, rgb(75, 147, 219) 49%, rgb(45, 111, 182) 100%)', color: 'white', fontSize: '20px' }}>{subject.subject}</div>
                                    <div className='mb-4 px-2'>
                                        {subject.questions.map((_, index) => (
                                            <button
                                                className={`btn ${getButtonColor(answers[questionsData[subjectCount[subject.subject].firstIndex + index].id]?.status)} rounded-circle me-2 ${subjectCount[subject.subject].firstIndex + index === currentPage ? 'active' : ''}`}
                                                key={index}
                                                onClick={() => handleQuestionButtonClick(subjectCount[subject.subject].firstIndex + index)}
                                            >
                                                {subjectCount[subject.subject].firstIndex + index + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {showStatistics && (
                    <Statistics statistics={statisticsData} onClose={() => setShowStatistics(false)} onSubmit={handleSubmit} />
                )}
            </div>
        </div>
    </>
    );
};

export default MainExam;
