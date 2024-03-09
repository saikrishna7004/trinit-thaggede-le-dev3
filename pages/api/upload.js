import multer from 'multer';

// Configure multer to store uploaded files in memory
const upload = multer();

export const config = {
    api: {
      bodyParser: false // Disable the built-in bodyParser
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        // Use multer middleware to parse the multipart/form-data request
        upload.single('file')(req, res, async function (err) {
            if (err) {
                console.error('File upload error:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            // Access the uploaded file from req.file
            const file = req.file;
            console.log('Uploaded file:', file);

            // Create FormData object and append necessary fields
            const formData = new FormData();
            formData.append('language', 'eng');
            formData.append('isOverlayRequired', 'false');
            formData.append('iscreatesearchablepdf', 'false');
            formData.append('issearchablepdfhidetextlayer', 'false');
            const blob = new Blob([file.buffer], { type: 'application/pdf' });
            formData.append('file', blob, file.originalname);
            formData.append('filetype', 'pdf');

            // Send the form data to OCR API using fetch
            const response = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                body: formData,
                headers: {
                    'apikey': process.env.OCR_API_KEY,
                }
            });

            if (!response.ok) {
                throw new Error(`OCR API request failed with status ${response.status}`);
            }

            // Parse and send OCR response to client
            const data = await response.json();
            console.log(data);
            res.status(200).json(data);
        });
    } catch (error) {
        console.error('OCR Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
