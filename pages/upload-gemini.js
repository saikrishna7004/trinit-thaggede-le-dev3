// pages/Testapi.js

import { useState } from 'react';

const Testapi = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) {
            console.error('No file selected');
            return;
        }

        try {
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
            console.log(data)
            await runGemini(JSON.stringify(data));
            console.log('OCR Response:', data);

        } catch (error) {
            console.error('Upload Error:', error);
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
        } catch (error) {
            console.error('Gemini API Error:', error);
        }
    };

    return (
        <div>
            <input type="file" id="fileInput" accept=".pdf" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Upload</button>
        </div>
    );
};

export default Testapi;
