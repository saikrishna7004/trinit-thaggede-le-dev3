import React, { useState, useEffect } from 'react';

const Question = ({ id, text, options, onOptionSelect, answerStatus, selected, index }) => {

    const handleOptionChange = (e) => {
        const selectedValue = e.target.value;
        onOptionSelect({ id, optionIndex: selectedValue });
    };

    return (
        <div className="question-container">
            <b>Question {index}: </b><br /><br />
            <p dangerouslySetInnerHTML={{ __html: text }}></p>
            <ul>
                {options.map((option, i) => (
                    <li key={i}>
                        <input
                            type="radio"
                            value={i}
                            checked={selected == i}
                            onChange={handleOptionChange}
                            className='form-check-input me-2'
                            id={index + 'a' + i}
                        />
                        <label className='form-check-label' htmlFor={index + 'a' + i}>{option}</label>
                    </li>
                ))}
            </ul>
            {status && (
                <div>
                    <p>Status: {answerStatus}</p>
                </div>
            )}
        </div>
    );
};

export default Question;
