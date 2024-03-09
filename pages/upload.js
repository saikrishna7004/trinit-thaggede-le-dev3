import { useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import Swal from 'sweetalert2';

const New = () => {
    const [subjects, setSubjects] = useState([{ name: '', questions: [{ text: '', options: [''], answer: 0, positiveMarks: 4, negativeMarks: -1 }] }]);
    const [examName, setExamName] = useState('');
    const [examDetails, setExamDetails] = useState({ duration: 180, maxMarks: 0 });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { data: session, status } = useSession();
    const [visibility, setVisibility] = useState('public');
    const [submitting, setSubmitting] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleExamNameChange = (e) => {
        setExamName(e.target.value);
    };

    const handleExamDetailsChange = (e) => {
        const { name, value } = e.target;
        setExamDetails({ ...examDetails, [name]: value });
    };

    const addSubject = (event) => {
        event.preventDefault();
        setSubjects([...subjects, { name: '', questions: [{ text: '', options: [''], answer: 0, positiveMarks: 4, negativeMarks: -1 }] }]);
    };

    const handleAddOption = (subjectIndex, questionIndex) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].questions[questionIndex].options.push('');
        setSubjects(newSubjects);
    };

    const handleQuestionChange = (e, subjectIndex, questionIndex) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].questions[questionIndex].text = e.target.value;
        setSubjects(newSubjects);
    };

    const handleOptionChange = (e, subjectIndex, questionIndex, optionIndex) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].questions[questionIndex].options[optionIndex] = e.target.value;
        setSubjects(newSubjects);
    };

    const handleAnswerChange = (e, subjectIndex, questionIndex) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].questions[questionIndex].answer = e.target.value;
        setSubjects(newSubjects);
    };

    const handlePositiveMarksChange = (e, subjectIndex, questionIndex) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].questions[questionIndex].positiveMarks = e.target.value;
        setSubjects(newSubjects);
    };

    const handleNegativeMarksChange = (e, subjectIndex, questionIndex) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].questions[questionIndex].negativeMarks = e.target.value;
        setSubjects(newSubjects);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        console.log(subjects)
        const examData = {
            title: examName,
            duration: examDetails.duration,
            maxMarks: examDetails.maxMarks,
            subjects: subjects.map(({ name, questions }) => ({
                name,
                questions: questions.map(({ text, options, answer, positiveMarks, negativeMarks }) => ({
                    text,
                    options,
                    answer,
                    positiveMarks,
                    negativeMarks
                }))
            })),
            user: session?.user?._id,
            status: visibility
        };

        try {
            const response = await fetch('/api/saveQuiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(examData),
            });

            if (response.ok) {
                Swal.fire('Success', 'Exam saved successfully!', 'success')
                console.log('Exam saved successfully');
            } else {
                console.error('Failed to save exam');
                Swal.fire('Failed', 'Exam save failed!', 'error')
            }
        } catch (error) {
            console.error('Error saving exam:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const deleteQuestion = (subjectIndex, questionIndex) => {
        const newSubjects = [...subjects];
        newSubjects[subjectIndex].questions.splice(questionIndex, 1);
        setSubjects(newSubjects);
    };

    const deleteSubject = (subjectIndex) => {
        const newSubjects = [...subjects];
        newSubjects.splice(subjectIndex, 1);
        setSubjects(newSubjects);
    };

    const fetchQuestionsFromPDF = async (subjectIndex) => {
        try {
            setUploading(true); // Set uploading state to true
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            const extractedQuestions = await runGemini(JSON.stringify(data));
            // Update the questions in the existing state for the selected subjectIndex
            setSubjects(subjects.map((subject, index) => {
                if (index === subjectIndex) {
                    return {
                        ...subject,
                        questions: [...subject.questions, ...extractedQuestions],
                    };
                }
                return subject;
            }));
            console.log('OCR Response:', data);
        } catch (error) {
            console.error('Upload Error:', error);
        } finally {
            setUploading(false); // Set uploading state back to false
        }
    };

    const runGemini = async (prompt) => {
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error(`Gemini API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log('Gemini API Output:', data);

            return data;

        } catch (error) {
            console.error('Gemini API Error:', error);
        }
    };

    return (
        <div className='mb-3'>
            <Head>
                <title>Upload Quiz</title>
            </Head>
            <div className='container mt-4'>
                <h3>Upload Questions</h3>
                <div className="my-3">
                    <label className='form-label'>Exam Name</label>
                    <input className='form-control' type="text" value={examName} onChange={handleExamNameChange} placeholder='Exam Name' />
                </div>
                <div className="my-3">
                    <label className='form-label'>Duration (in minutes)</label>
                    <input className='form-control' type="number" name="duration" value={examDetails.duration} onChange={handleExamDetailsChange} />
                </div>
                <div className="my-3">
                    <label className='form-label'>Maximum Marks</label>
                    <input className='form-control' type="number" name="maxMarks" value={examDetails.maxMarks} onChange={handleExamDetailsChange} />
                </div>
                <div className="my-3">
                    <label className='form-label'>Visibility</label>
                    <select className='form-select' value={visibility} onChange={e=>setVisibility(e.target.value)}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                {subjects.map((subject, subjectIndex) => (
                    <div key={subjectIndex}><hr className='my-4'/>
                    <div style={{border: '1px solid'}} className='p-4 my-4'>
                        <div className='mb-3'>
                            <label className='form-label'>Subject Name</label>
                            <input className='form-control' type="text" value={subject.name} onChange={(e) => setSubjects(subjects.map((s, i) => (i === subjectIndex ? { ...s, name: e.target.value } : s)))} />
                            <button className='btn btn-danger mt-2' onClick={() => deleteSubject(subjectIndex)}>Delete Subject</button>
                            <div className="my-3">
                                <label className='form-label'>Upload PDF File &nbsp;</label>
                                <input className='form-control' type="file" onChange={handleFileChange} accept=".pdf" />
                                <button className='btn btn-primary mt-2' onClick={() => fetchQuestionsFromPDF(subjectIndex)} disabled={uploading}>Upload{uploading && 'ing...'}</button>
                            </div>
                        </div>
                        {subject.questions.map((question, questionIndex) => (
                            <div className='card d-block p-3 my-3' key={questionIndex}>
                                <div className="mb-2">
                                    <label className='form-label'>Question {questionIndex + 1}:</label>
                                    <input className='form-control' type="text" value={question.text} onChange={(e) => handleQuestionChange(e, subjectIndex, questionIndex)} />
                                </div>
                                {question.options.map((option, optionIndex) => (
                                    <div className="row my-2" key={`${questionIndex}-${optionIndex}`}>
                                        <div className="col-md-3 mb-2">
                                            <label className='form-label'>Option {optionIndex + 1}</label>
                                            <input className='form-control' type="text" value={option} onChange={(e) => handleOptionChange(e, subjectIndex, questionIndex, optionIndex)} />
                                        </div>
                                    </div>
                                ))}
                                <button className='btn btn-primary mb-2' onClick={() => handleAddOption(subjectIndex, questionIndex)}>+ Add Option</button>
                                <div className="row my-2">
                                    <div className="col-md-3 mb-2">
                                        <label className='form-label'>Answer</label>
                                        <input className='form-control' type="number" value={question.answer} onChange={(e) => handleAnswerChange(e, subjectIndex, questionIndex)} />
                                    </div>
                                    <div className="col-md-3 mb-2">
                                        <label className='form-label'>Positive Marks</label>
                                        <input className='form-control' type="number" value={question.positiveMarks} onChange={(e) => handlePositiveMarksChange(e, subjectIndex, questionIndex)} />
                                    </div>
                                    <div className="col-md-3 mb-2">
                                        <label className='form-label'>Negative Marks</label>
                                        <input className='form-control' type="number" value={question.negativeMarks} onChange={(e) => handleNegativeMarksChange(e, subjectIndex, questionIndex)} />
                                    </div>
                                </div>
                                <button className='btn btn-outline-dark' onClick={() => deleteQuestion(subjectIndex, questionIndex)} style={{ position: 'absolute', right: '15px', bottom: '15px' }} aria-label='Delete'>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))}
                        <button className='btn btn-primary mb-4' onClick={() => setSubjects(subjects.map((s, i) => (i === subjectIndex ? { ...s, questions: [...s.questions, { text: '', options: [''], answer: 0, positiveMarks: 4, negativeMarks: -1 }] } : s)))}>+ Add Question</button>
                    </div>
                    </div>
                ))}
                <button className='btn btn-primary mb-4 mx-2' onClick={addSubject}>+ Add Subject</button>
                <button className='btn btn-primary mb-4 mx-2' onClick={handleSubmit} disabled={submitting}>Submit{submitting && 'ting...'}</button>
            </div>
        </div>
    );
}

export default New;
