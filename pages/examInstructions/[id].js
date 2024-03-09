import React, { useEffect, useState } from 'react';
import MainExam from '../../components/MainExam';
import { useRouter } from 'next/router';

const ExamPage = ({ params }) => {
    const [agree, setAgree] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [examId, setExamId] = useState('')
    const [exam, setExam] = useState(null);
    const [timer, setTimer] = useState(null);

    const router = useRouter()

    useEffect(() => {
        console.log(router.query)
        setExamId(router.query.id)
    }, [router.query]);

    const startTimer = (duration) => {
        const startTime = new Date().getTime();
        const endTime = startTime + duration * 60000;

        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const remainingTime = endTime - currentTime;

            if (remainingTime <= 0) {
                clearInterval(interval);
                // Handle timer expiration
            } else {
                setTimer(formatTime(remainingTime));
            }
        }, 1000);
        setTimer(interval);
    };

    const formatTime = (milliseconds) => {
        const hours = Math.floor(milliseconds / 3600000);
        const minutes = Math.floor((milliseconds % 3600000) / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    
    const handleAgreeChange = (e) => {
        setAgree(e.target.checked);
    };

    const handleNextPage = async () => {
        if (currentPage === 2 && agree) {
            setLoading(true);
            try {
                console.log(examId, window.opener.params)
                const response = await fetch('/api/questions/' + examId);
                console.log(response)
                const data = await response.json();
                console.log(data)
                setLoading(false);
                if (response.ok) {
                    setQuestions(data.questions);
                    setCurrentPage(currentPage + 1);
                    startTimer(data.exam.duration);
                    setExam(data.exam)
                } else {
                    throw new Error('Failed to fetch questions');
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        } else {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage(currentPage - 1);
    };

    return (
        <div className="container-fluid my-3 alldiv">
            {currentPage === 1 && (
                <div id="id1" className="mainsets container-fluid border">
                    <div className="container-fluid border my-2 px-4">
                        <h1 className="text-center">Exam Instructions</h1>
                    </div>
                    <div className="container-fluid border my-3 p-3 text-center">
                        <h5>Basic Instructions</h5>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum expedita eligendi itaque iste dolores consequatur culpa sequi sunt, molestias iusto fugiat eos mollitia! Numquam recusandae error laboriosam dignissimos quibusdam delectus nesciunt ipsam nulla dolor iste, at totam, dolore rerum, consectetur animi blanditiis nemo suscipit reiciendis quidem quia deleniti earum illum eaque exercitationem? Molestiae voluptatum veniam, magni omnis natus cumque, non exercitationem commodi autem, consequatur adipisci animi sapiente officia sed quam. Rerum recusandae praesentium similique a quibusdam laudantium facilis quis sequi quasi quia corporis provident, repudiandae soluta, cupiditate reprehenderit ex blanditiis quod eveniet nulla impedit veritatis iure quas tempora. Eius, aliquid.
                        </p>
                    </div>
                </div>
            )}
            {currentPage === 2 && (
                <div id="id2" className="mainsets container-fluid border">
                    <div className="container-fluid border my-2 px-4">
                        <h1 className="text-center">Exam Instructions</h1>
                    </div>
                    <div className="container-fluid border my-2 px-4">
                        <div>
                            <h4><u>General Instructions:</u></h4>
                            <ol>
                                <li>
                                    Total duration of examination is 180 minutes.
                                </li>
                                <li>
                                    The clock will be set at the server. The countdown timer in the top right comer of screen
                                    will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.
                                </li>
                                <li>
                                    The Question Palette displayed on the right side of screen will show the status of each
                                    question using one of the following symbols
                                    <ul>
                                        <li>
                                            &quot;Not Visited&quot;- You have not visited the question yet.
                                        </li>
                                        <li>
                                            &quot;Not Answered&quot; - You have not answered the question.
                                        </li>
                                        <li>
                                            &quot;Answered&quot; You have answered the question.
                                        </li>
                                        <li>
                                            &quot;Marked for Review&quot; - You have NOT answered the question, but have marked the
                                            question for review.
                                        </li>
                                        <li>
                                            &quot;Answered and Marked for Review&quot; - The question(s) Answered and Marked for Review&quot;
                                            will be considered for evaluation.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    The Marked for Review status for a question simply indicates that you would like to look at
                                    that question again.
                                </li>
                                <li>
                                    You can click on the arrow which appears to the left of question palette to collapse the
                                    question palette thereby maximizing the question window. To view the question palette again, you can
                                    click on &quot; &quot; which appears on the right side of question window.
                                </li>
                                <li>
                                    You can click on your &quot;Profile&quot; image on top right comer of your screen to change the
                                    language during the exam for entire question paper. On clicking of Profile image you will get a drop down to
                                    change the question content to the desired language.
                                </li>
                                <li>
                                    You can click on to navigate to the bottom and to navigate to the top of the question area,
                                    without scrolling
                                </li>
                            </ol>
                            <h4><u>Navigating to a Question:</u></h4>
                            <ol start="8">
                                <li>
                                    To answer a question, do the following:
                                    <ol type="a">
                                        <li>
                                            Click on the question number in the Question Palette at the right of your screen to
                                            go to that numbered question directly. Note that using this option does NOT save your answer to the current question.
                                        </li>
                                        <li>
                                            Click on Save & Next to save your answer for the current question and then go to the
                                            next question.
                                        </li>
                                        <li>
                                            Click on Mark for Review & Next to save your answer for the current question, mark it for review,
                                            and then go to the next question.
                                        </li>
                                    </ol>
                                </li>
                            </ol>
                            <h4><u>Answering a Question:</u></h4>
                            <ol start="9">
                                <li>
                                    Procedure for answering a multiple choice type question:
                                </li>
                                <ol type="a">
                                    <li>
                                        To select your answer, click on the button of one of the options
                                    </li>
                                    <li>
                                        To deselect your chosen answer, click on the button of the chosen option again or click
                                        on the Clear Response button
                                    </li>
                                    <li>
                                        To change your chosen answer. click on the button of another option
                                    </li>
                                    <li>
                                        To save your answer, you MUST click on the Save & Next button
                                    </li>
                                    <li>
                                        To mark the question for review, click on the Mark for Review & Next button.
                                    </li>
                                    <li>
                                        To change your answer to a question that has already been answered, first select that
                                        question for answering and then follow the procedure for answering that type of question.
                                        <br />
                                    </li>
                                </ol>
                            </ol>
                            <h4><u>Navigating through sections:</u></h4>
                            <ol start="10">
                                <li>
                                    Sections in this question paper are displayed on the top bar of the
                                    screen. Questions in a section can be viewed by clicking on the section name. The section
                                    you are currently viewing is highlighted.
                                </li>
                                <li>
                                    After clicking the Save & Next button on the last question for a section, your
                                    will automatically be taken to the first question of the next section.
                                </li>
                                <li>
                                    You can shuffle between sections and questions anytime during the examination as per your convenience only during the time stipulated.
                                </li>
                                <li>
                                    Candidate can view the corresponding section summary as part of the legend that appears in
                                    every section above the question palette.
                                </li>
                            </ol>
                        </div>
                        <div>
                            <hr className="mt-4 mb-2" />
                            <div>
                                <input
                                    id="agree"
                                    type="checkbox"
                                    checked={agree}
                                    onChange={handleAgreeChange}
                                />
                                <label htmlFor="agree">
                                    I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and / or to disciplinary action, which may include ban from future Tests / Examinations.
                                </label>
                                <hr className="mt-4 mb-2" />
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
            {
                (currentPage === 1 || currentPage === 2) && (
                    <div className="row container mx-auto">
                        {currentPage === 2 && (
                            <>
                                <button
                                    className="btn col-4 my-3 px-1 py-2"
                                    onClick={handlePreviousPage}
                                    style={{ width: '50%', backgroundColor: '#347ab7', color: 'white', borderRadius: 0, borderColor: '#cccccc', fontSize: 'small' }}
                                >
                                    &lt; Previous
                                </button>
                                <button
                                    className="btn col-4 my-3 px-0 py-2"
                                    onClick={handleNextPage}
                                    style={{ width: '50%', backgroundColor: '#347ab7', color: 'white', borderRadius: 0, borderColor: '#cccccc', fontSize: 'small' }}
                                    disabled={!agree}
                                >
                                    I am ready to begin
                                </button>
                            </>
                        )}
                        {currentPage === 1 && (
                            <button
                                className="btn col-4 my-3 px-0 py-2"
                                onClick={handleNextPage}
                                style={{ width: '50%', backgroundColor: '#347ab7', color: 'white', borderRadius: 0, borderColor: '#cccccc', fontSize: 'small', float: 'right', marginLeft: 'auto' }}
                            >
                                Next &gt;
                            </button>
                        )}
                    </div>
                )
            }
            {currentPage === 3 && questions.length > 0 && (
                <div id="questions-container">
                    <MainExam quizId={examId} questions={questions} exam={exam} timer={timer} />
                </div>
            )}
            {
                loading && <div id="loading"></div>
            }
        </div>
    );
};

export default ExamPage;
